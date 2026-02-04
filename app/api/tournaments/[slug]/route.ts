import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const slug = params.slug;

  const t = await prisma.tournament.findUnique({
    where: { slug },
    include: { prizes: true },
  });
  if (!t) return jsonErr("Tournament not found", 404);

  const top = await prisma.tournamentEntry.findMany({
    where: { tournamentId: t.id },
    orderBy: [{ points: "desc" }, { updatedAt: "asc" }],
    take: 100,
    include: { user: { select: { email: true } } },
  });

  const au = await getUserFromRequest(req);
  let me: any = null;
  if (au) {
    const entry = await prisma.tournamentEntry.findUnique({
      where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
      include: { user: { select: { email: true } } },
    });
    if (entry) {
      const betterCount = await prisma.tournamentEntry.count({
        where: { tournamentId: t.id, points: { gt: entry.points } },
      });
      me = { entry, rank: betterCount + 1 };
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
      prizes: t.prizes,
    },
    top: top.map((e, idx) => ({
      rank: idx + 1,
      userId: e.userId,
      email: e.user.email,
      points: e.points,
      roundsCount: e.roundsCount,
      bestMultiplier: e.bestMultiplier,
    })),
    me,
  });
}
