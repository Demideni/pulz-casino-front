import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureDailySprint() {
  const now = new Date();
  const slug = "daily-sprint";
  let t = await prisma.tournament.findUnique({ where: { slug } });
  if (!t) {
    t = await prisma.tournament.create({
      data: {
        slug,
        name: "Daily Sprint 24/7",
        type: "DAILY_SPRINT",
        status: "ACTIVE",
        startsAt: now,
        endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        kFactor: 10,
        prizePoolCents: 0,
      },
    });
  } else if (t.status !== "ACTIVE") {
    t = await prisma.tournament.update({ where: { id: t.id }, data: { status: "ACTIVE" } });
  }
  return t;
}

export async function GET(req: NextRequest) {
  try {
    const au = await getUserFromRequest(req);
    const t = await ensureDailySprint();

    const top = await prisma.tournamentEntry.findMany({
      where: { tournamentId: t.id },
      orderBy: [{ points: "desc" }, { updatedAt: "asc" }],
      take: 100,
      select: {
        userId: true,
        points: true,
        bestMultiplier: true,
        roundsCount: true,
        user: { select: { email: true } },
      },
    });

    let me: any = null;
    if (au) {
      const mine = await prisma.tournamentEntry.findUnique({
        where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
        select: { points: true, bestMultiplier: true, roundsCount: true },
      });

      if (mine) {
        // rank: count users with more points
        const better = await prisma.tournamentEntry.count({
          where: { tournamentId: t.id, points: { gt: mine.points } },
        });
        me = { rank: better + 1, ...mine };
      } else {
        me = { rank: null, points: 0, bestMultiplier: 0, roundsCount: 0 };
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
