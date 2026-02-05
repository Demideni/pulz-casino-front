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

      // ---- Tournament (Daily Sprint 24/7) ----
      try {
        const now = new Date();
        let t = await tx.tournament.findFirst({
          where: { slug: "daily-sprint", status: "ACTIVE", endsAt: { gt: now } },
        });
        if (!t) {
          t = await tx.tournament.create({
            data: {
              slug: "daily-sprint",
              name: "Daily Sprint",
              type: "DAILY_SPRINT",
              status: "ACTIVE",
              startsAt: now,
              endsAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
              kFactor: 10,
              prizePoolCents: 0,
            },
          });
        }

        const existingRound = await tx.tournamentRound.findUnique({
          where: { tournamentId_roundId: { tournamentId: t.id, roundId: body.roundId } },
          select: { id: true },
        });
        if (!existingRound) {
          const points = Math.sqrt(betTx.amountCents / 100) * body.multiplier * t.kFactor;

          await tx.tournamentRound.create({
            data: {
              tournamentId: t.id,
              userId: au.id,
              roundId: body.roundId,
              stakeCents: betTx.amountCents,
              multiplier: body.multiplier,
              points,
            },
          });

          const entry = await tx.tournamentEntry.findUnique({
            where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
            select: { id: true, bestMultiplier: true },
          });
          if (!entry) {
            await tx.tournamentEntry.create({
              data: {
                tournamentId: t.id,
                userId: au.id,
                points,
                bestMultiplier: body.multiplier,
                roundsCount: 1,
                lastRoundAt: now,
              },
            });
          } else {
            await tx.tournamentEntry.update({
              where: { id: entry.id },
              data: {
                points: { increment: points },
                roundsCount: { increment: 1 },
                lastRoundAt: now,
                bestMultiplier: { set: Math.max(entry.bestMultiplier ?? 0, body.multiplier) },
              },
            });
          }
        }
      } catch (e) {
        // never fail the payout because of tournament scoring
        console.error("Tournament scoring failed", e);
      }
      // ---- /Tournament ----

    });

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