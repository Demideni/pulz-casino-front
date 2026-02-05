import { prisma } from "@/lib/db";

export const DAILY_SPRINT_SLUG = "daily-sprint";

export async function ensureDailySprintActive() {
  const now = new Date();

  // Find active daily sprint where endsAt is still in future
  const existing = await prisma.tournament.findFirst({
    where: {
      slug: DAILY_SPRINT_SLUG,
      status: "ACTIVE",
      endsAt: { gt: now },
    },
  });

  if (existing) return existing;

  // Create new 24h window
  const startsAt = now;
  const endsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return prisma.tournament.create({
    data: {
      slug: DAILY_SPRINT_SLUG,
      name: "Daily Sprint",
      type: "DAILY_SPRINT",
      status: "ACTIVE",
      startsAt,
      endsAt,
      kFactor: 10,
      prizePoolCents: 0,
    },
  });
}
