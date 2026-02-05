import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureDailySprint() {
  const now = new Date();
  const existing = await prisma.tournament.findFirst({
    where: { slug: "daily-sprint", status: "ACTIVE", endsAt: { gt: now } },
  });
  if (existing) return existing;

  // create a new 24h tournament starting now
  const endsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return prisma.tournament.create({
    data: {
      slug: "daily-sprint",
      name: "Daily Sprint",
      type: "DAILY_SPRINT",
      status: "ACTIVE",
      startsAt: now,
      endsAt,
      kFactor: 10,
      prizePoolCents: 0,
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const au = await getUserFromRequest(req);
    const t = await ensureDailySprint();

    const top = await prisma.tournamentEntry.findMany({
      where: { tournamentId: t.id },
      orderBy: [{ points: "desc" }, { lastRoundAt: "asc" }],
      take: 100,
      select: { userId: true, points: true, bestMultiplier: true, roundsCount: true, lastRoundAt: true },
    });

    let me: any = null;
    if (au) {
      const entry = await prisma.tournamentEntry.findUnique({
        where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
        select: { userId: true, points: true, bestMultiplier: true, roundsCount: true, lastRoundAt: true },
      });
      if (entry) {
        const rank = await prisma.tournamentEntry.count({
          where: { tournamentId: t.id, points: { gt: entry.points } },
        });
        me = { ...entry, rank: rank + 1 };
      }
    }

    return jsonOk({
      tournament: {
        id: t.id,
        slug: t.slug,
        name: t.name,
        type: t.type,
        status: t.status,
        startsAt: t.startsAt,
        endsAt: t.endsAt,
        kFactor: t.kFactor,
        prizePoolCents: t.prizePoolCents,
      },
      top,
      me,
    });
  } catch (e) {
    console.error(e);
    return jsonErr("Server error", 500);
  }
}
