import { prisma } from "@/lib/db";

export const DAILY_TOURNAMENT_SLUG = "daily-sprint";

export async function ensureDailySprintTournament() {
  const now = new Date();

  // We run a "24/7" daily sprint by rolling the window forward automatically.
  // If tournament expired, we complete it and create a new one.
  const existing = await prisma.tournament.findUnique({ where: { slug: DAILY_TOURNAMENT_SLUG } });

  if (existing) {
    if (existing.endsAt.getTime() > now.getTime() && existing.status === "ACTIVE") return existing;

    // Mark completed if time passed
    if (existing.status !== "COMPLETED") {
      await prisma.tournament.update({
        where: { id: existing.id },
        data: { status: "COMPLETED" },
      });
    }
  }

  // Create (or recreate) a new active tournament window: last 24h / next 24h
  const startsAt = new Date(now.getTime());
  const endsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // If slug existed, we keep same slug and overwrite by deleting old one is not possible due to FK;
  // so we use stable slug only for the active tournament. We upsert by slug, resetting fields and
  // clearing previous entries is not desirable; therefore if old exists we create a new slug with timestamp.
  if (existing) {
    const slug = `${DAILY_TOURNAMENT_SLUG}-${now.toISOString().slice(0,10)}-${now.getTime()}`;
    return await prisma.tournament.create({
      data: {
        slug,
        name: "Daily Sprint",
        type: "DAILY_SPRINT",
        status: "ACTIVE",
        startsAt,
        endsAt,
        kFactor: 10,
        prizePoolCents: 0,
        prizes: {
          createMany: {
            data: defaultPrizes(),
          },
        },
      },
    });
  }

  return await prisma.tournament.create({
    data: {
      slug: DAILY_TOURNAMENT_SLUG,
      name: "Daily Sprint",
      type: "DAILY_SPRINT",
      status: "ACTIVE",
      startsAt,
      endsAt,
      kFactor: 10,
      prizePoolCents: 0,
      prizes: {
        createMany: {
          data: defaultPrizes(),
        },
      },
    },
  });
}

export function calcTournamentPoints(params: { stakeCents: number; multiplier: number; kFactor: number }) {
  const stakeUsd = Math.max(0, params.stakeCents) / 100;
  const mult = Math.max(0, params.multiplier);
  const K = Math.max(0, params.kFactor);

  // Points formula: sqrt(stake) * multiplier * K
  const pts = Math.sqrt(stakeUsd) * mult * K;

  // Hard cap to avoid insane spikes
  return Math.min(pts, 999999);
}

function defaultPrizes() {
  return [
    { placeFrom: 1, placeTo: 1, amountCents: 50000 },
    { placeFrom: 2, placeTo: 2, amountCents: 25000 },
    { placeFrom: 3, placeTo: 3, amountCents: 15000 },
    { placeFrom: 4, placeTo: 10, amountCents: 5000 },
  ];
}
