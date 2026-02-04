import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const au = await getUserFromRequest(req);
  if (!au) return jsonErr("Unauthorized", 401);

  const t = await prisma.tournament.findUnique({ where: { slug: params.slug } });
  if (!t) return jsonErr("Tournament not found", 404);
  if (t.status !== "ACTIVE") return jsonErr("Tournament is not active", 400);

  const entry = await prisma.tournamentEntry.upsert({
    where: { tournamentId_userId: { tournamentId: t.id, userId: au.id } },
    update: {},
    create: { tournamentId: t.id, userId: au.id },
  });

  return jsonOk({ entry });
}
