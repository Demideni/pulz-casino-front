import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonOk, jsonErr } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function maskEmail(email: string) {
  const [u, d] = email.split("@");
  if (!u || !d) return email;
  const head = u.slice(0, 2);
  return `${head}***@${d}`;
}

async function ensureDailySprint() {
  const now = new Date();
  let t = await prisma.tournament.findFirst({
    where: { slug: "daily-sprint", status: "ACTIVE", endsAt: { gt: now } },
  });
  if (!t) {
    t = await prisma.tournament.create({
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
  return t;
}

export async function GET(req: NextRequest) {
  const au = await getUserFromRequest(req);
  try {
    const t = await ensureDailySprint();

    const top = await prisma.tournamentEntry.findMany({
      where: { tournamentId: t.id },
      orderBy: [{ points: "desc" }, { lastRoundAt: "desc" }],
      take: 100,
      select: {
        user: { select: { email: true } },
        points: true,
        roundsCount: true,
        bestMultiplier: true,
      },
    });

    let me = null as null | { points: number; rank: number; roundsCount: number; bestMultiplier: number };
    if (au) {
      const mine = await prisma.tournamentEntry.findUnique({
        where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
        select: { points: true, roundsCount: true, bestMultiplier: true },
      });

      if (mine) {
        // rank = number of users with strictly higher points + 1
        const higher = await prisma.tournamentEntry.count({
          where: { tournamentId: t.id, points: { gt: mine.points } },
        });
        me = { points: mine.points, roundsCount: mine.roundsCount, bestMultiplier: mine.bestMultiplier, rank: higher + 1 };
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
      leaderboard: top.map((x) => ({
        name: maskEmail(x.user.email),
        points: x.points,
        roundsCount: x.roundsCount,
        bestMultiplier: x.bestMultiplier,
      })),
      me,
    });
  } catch (e: any) {
    console.error(e);
    return jsonErr("Server error", 500);
  }
}
