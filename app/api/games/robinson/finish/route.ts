import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";
import { ensureDailySprintTournament, calcTournamentPoints } from "@/lib/tournaments";

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


    // Tournament (Daily Sprint 24/7)
    const activeTournament = await prisma.tournament.findFirst({
      where: { status: "ACTIVE", type: "DAILY_SPRINT" },
      orderBy: { createdAt: "desc" },
    });

    const tournament = activeTournament ?? (await ensureDailySprintTournament());


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

  // Update tournament leaderboard (idempotent per roundId)
  if (tournament && tournament.status === "ACTIVE") {
    const points = calcTournamentPoints({
      stakeCents: betTx.amountCents,
      multiplier: body.multiplier,
      kFactor: tournament.kFactor,
    });

    // Store per-round result (guarded by unique constraint)
    try {
      await tx.tournamentRound.create({
        data: {
          tournamentId: tournament.id,
          userId: au.id,
          roundId: body.roundId,
          stakeCents: betTx.amountCents,
          multiplier: body.multiplier,
          points,
        },
      });
    } catch {
      // already counted for this roundId
      return;
    }

    const existingEntry = await tx.tournamentEntry.findUnique({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId: au.id } },
      select: { bestMultiplier: true },
    });

    const bestMultiplier =
      existingEntry && existingEntry.bestMultiplier > body.multiplier
        ? existingEntry.bestMultiplier
        : body.multiplier;

    await tx.tournamentEntry.upsert({
      where: { tournamentId_userId: { tournamentId: tournament.id, userId: au.id } },
      update: {
        points: { increment: points },
        roundsCount: { increment: 1 },
        lastRoundAt: new Date(),
        bestMultiplier,
      },
      create: {
        tournamentId: tournament.id,
        userId: au.id,
        points,
        roundsCount: 1,
        lastRoundAt: new Date(),
        bestMultiplier,
      },
    });
  }
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

      // Update tournament leaderboard (idempotent per roundId)
      if (tournament && tournament.status === "ACTIVE") {
        const points = calcTournamentPoints({
          stakeCents: betTx.amountCents,
          multiplier: body.multiplier,
          kFactor: tournament.kFactor,
        });
      
        // Store per-round result (guarded by unique constraint)
        try {
          await tx.tournamentRound.create({
            data: {
              tournamentId: tournament.id,
              userId: au.id,
              roundId: body.roundId,
              stakeCents: betTx.amountCents,
              multiplier: body.multiplier,
              points,
            },
    });
  } catch {
    // already counted for this roundId
  }

  const existingEntry = await tx.tournamentEntry.findUnique({
    where: { tournamentId_userId: { tournamentId: tournament.id, userId: au.id } },
    select: { bestMultiplier: true },
  });

  await tx.tournamentEntry.upsert({
    where: { tournamentId_userId: { tournamentId: tournament.id, userId: au.id } },
    update: {
      points: { increment: points },
      roundsCount: { increment: 1 },
      lastRoundAt: new Date(),
      bestMultiplier:
        existingEntry && existingEntry.bestMultiplier > body.multiplier
          ? existingEntry.bestMultiplier
          : body.multiplier,
    },
    create: {
      tournamentId: tournament.id,
      userId: au.id,
      points,
      roundsCount: 1,
      lastRoundAt: new Date(),
      bestMultiplier: body.multiplier,
    },
  });
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