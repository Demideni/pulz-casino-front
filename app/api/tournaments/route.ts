import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";
import { ensureDailySprintActive } from "@/lib/tournaments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const t = await ensureDailySprintActive();

    const top = await prisma.tournamentEntry.findMany({
      where: { tournamentId: t.id },
      orderBy: [{ points: "desc" }, { updatedAt: "asc" }],
      take: 100,
      select: {
        userId: true,
        points: true,
        bestMultiplier: true,
        roundsCount: true,
        updatedAt: true,
        user: { select: { email: true } },
      },
    });

    const au = await getUserFromRequest(req);
    let me: any = null;

    if (au) {
      const myEntry = await prisma.tournamentEntry.findUnique({
        where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
        select: { points: true, bestMultiplier: true, roundsCount: true, updatedAt: true },
      });

      if (myEntry) {
        // rank = count of entries with more points + 1
        const higher = await prisma.tournamentEntry.count({
          where: { tournamentId: t.id, points: { gt: myEntry.points } },
        });
        me = { rank: higher + 1, ...myEntry };
      } else {
        me = { rank: null, points: 0, bestMultiplier: 1, roundsCount: 0 };
      }
    }

    return jsonOk({
      active: {
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
      leaderboard: top.map((e, idx) => ({
        rank: idx + 1,
        userId: e.userId,
        name: e.user?.email?.split("@")[0] ?? "Player",
        points: e.points,
        bestMultiplier: e.bestMultiplier,
        roundsCount: e.roundsCount,
      })),
      me,
    });
  } catch (e) {
    console.error(e);
    return jsonErr("Server error", 500);
  }
}
