import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonOk } from "@/lib/http";
import { ensureDailySprintTournament } from "@/lib/tournaments";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Ensure we always have an active Daily Sprint
  const t = await prisma.tournament.findFirst({
    where: { status: "ACTIVE", type: "DAILY_SPRINT" },
    orderBy: { createdAt: "desc" },
    include: { prizes: true },
  }) ?? (await ensureDailySprintTournament());

  const au = await getUserFromRequest(req);

  let me: any = null;
  if (au) {
    const entry = await prisma.tournamentEntry.findUnique({
      where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
    });

    if (entry) {
      const betterCount = await prisma.tournamentEntry.count({
        where: { tournamentId: t.id, points: { gt: entry.points } },
      });
      me = {
        entry,
        rank: betterCount + 1,
      };
    }
  }

  return jsonOk({
    daily: {
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
    me,
  });
}
