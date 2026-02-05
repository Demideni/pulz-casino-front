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

    // 1) Find the BET transaction for this round
    const betTx = await prisma.transaction.findFirst({
      where: {
        userId: au.id,
        type: "BET",
        meta: { path: ["roundId"], equals: body.roundId },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!betTx) return jsonErr("Round not found", 404);

    // 2) Prevent double-finish: if WIN already exists for this round, return current balance
    const winExists = await prisma.transaction.findFirst({
      where: {
        userId: au.id,
        type: "WIN",
        meta: { path: ["roundId"], equals: body.roundId },
      },
      select: { id: true },
    });

    if (winExists) {
      const u = await prisma.user.findUnique({
        where: { id: au.id },
        select: { balanceCents: true },
      });
      return jsonOk({ balanceCents: u?.balanceCents ?? 0, winCents: 0 });
    }

    // 3) Calculate payout
    const payoutCents = Math.max(0, Math.round(betTx.amountCents * body.multiplier));

    // 4) Atomic write: update balance + create WIN tx
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

        const points =
  Math.sqrt(betTx.amountCents / 100) *
  body.multiplier *
  t.kFactor;


        // write round (idempotent per tournamentId+roundId)
        await tx.tournamentRound.upsert({
          where: { tournamentId_roundId: { tournamentId: t.id, roundId: body.roundId } },
          update: {},
          create: {
            tournamentId: t.id,
            userId: au.id,
            roundId: body.roundId,
            stakeCents: betTx.amountCents,
            multiplier: body.multiplier,
            points,
          },
        });

        await tx.tournamentEntry.upsert({
          where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
          update: {
            points: { increment: points },
            roundsCount: { increment: 1 },
            bestMultiplier: { set: Math.max(body.multiplier, 1) }, // will be corrected below
            lastRoundAt: now,
          },
          create: {
            tournamentId: t.id,
            userId: au.id,
            points,
            roundsCount: 1,
            bestMultiplier: Math.max(body.multiplier, 1),
            lastRoundAt: now,
          },
        });

        // ensure bestMultiplier is max (needs separate read in update; keep simple: recompute)
        await tx.tournamentEntry.update({
          where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
          data: {
            bestMultiplier: {
              set: await (async () => {
                const cur = await tx.tournamentEntry.findUnique({
                  where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
                  select: { bestMultiplier: true },
                });
                return Math.max(cur?.bestMultiplier ?? 1, body.multiplier);
              })(),
            },
          },
        });
      } catch (e) {
        // Do not fail the payout if tournament tables are unavailable.
        console.error("[tournament] update failed", e);
      }
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
