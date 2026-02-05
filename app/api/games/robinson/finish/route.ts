import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const Body = z.object({
  roundId: z.string().min(1),
  multiplier: z.number().min(0),
});

export async function POST(req: NextRequest) {
  const au = await getUserFromRequest(req);
  if (!au) return jsonErr("Unauthorized", 401);

  try {
    const body = Body.parse(await req.json());

    // Find the bet transaction for this round
    const betTx = await prisma.transaction.findFirst({
      where: {
        userId: au.id,
        type: "BET",
        meta: { path: ["roundId"], equals: body.roundId },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!betTx) return jsonErr("Round not found", 404);

    // Prevent double-finish (simple check: if WIN exists for this round)
    const winExists = await prisma.transaction.findFirst({
      where: {
        userId: au.id,
        type: "WIN",
        meta: { path: ["roundId"], equals: body.roundId },
      },
    });
    if (winExists) return jsonOk({ balanceCents: (await prisma.user.findUnique({where:{id:au.id},select:{balanceCents:true}}))?.balanceCents ?? 0, winCents: 0 });

    const payoutCents = Math.max(0, Math.round(betTx.amountCents * body.multiplier));

    await prisma.$transaction(async (tx) => {
      if (payoutCents > 0) {
        await tx.user.update({
          where: { id: au.id },
          data: { balanceCents: { increment: payoutCents } },
        });
      }
      await tx.transaction.create({
        data: {
          userId: au.id,
          type: "WIN",
          amountCents: payoutCents,
          meta: { game: "robinson", roundId: body.roundId, multiplier: body.multiplier },
        },
      });
    });


// ---- Tournament (Daily Sprint 24/7) ----
try {
  const t = await prisma.tournament.findUnique({ where: { slug: "daily-sprint" } });
  const tour = t
    ? (t.status === "ACTIVE" ? t : await prisma.tournament.update({ where: { id: t.id }, data: { status: "ACTIVE" } }))
    : await prisma.tournament.create({
        data: {
          slug: "daily-sprint",
          name: "Daily Sprint",
          type: "DAILY_SPRINT",
          status: "ACTIVE",
          startsAt: new Date(),
          endsAt: null,
          kFactor: 10,
          prizePoolCents: 0,
        },
      });

  const stakeCents = betTx.amountCents;
  const points = Math.sqrt(stakeCents / 100) * body.multiplier * (tour.kFactor ?? 10);

  await prisma.$transaction(async (tx) => {
    // write round (idempotent per tournamentId+userId+roundId)
    await tx.tournamentRound.upsert({
      where: { tournamentId_userId_roundId: { tournamentId: tour.id, userId: au.id, roundId: body.roundId } },
      update: {},
      create: {
        tournamentId: tour.id,
        userId: au.id,
        roundId: body.roundId,
        stakeCents,
        multiplier: body.multiplier,
        points,
      },
    });

    // update entry
    await tx.tournamentEntry.upsert({
      where: { tournamentId_userId: { tournamentId: tour.id, userId: au.id } },
      update: {
        points: { increment: points },
        roundsCount: { increment: 1 },
        bestMultiplier: { set: Math.max(0, body.multiplier) },
        lastRoundAt: new Date(),
      },
      create: {
        tournamentId: tour.id,
        userId: au.id,
        points,
        roundsCount: 1,
        bestMultiplier: Math.max(0, body.multiplier),
        lastRoundAt: new Date(),
      },
    });
  });
} catch (e) {
  // never break payouts if tournament fails
  console.error("tournament update failed", e);
}
    const updated = await prisma.user.findUnique({
      where: { id: au.id },
      select: { balanceCents: true },
    });

    return jsonOk({ balanceCents: updated?.balanceCents ?? 0, winCents: payoutCents });
  } catch (e: any) {
    if (e?.name === "ZodError") return jsonErr("Invalid input", 422, e.issues);
    console.error(e);
    return jsonErr("Server error", 500);
  }
}