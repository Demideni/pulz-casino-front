import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";
import { isAdminEmail } from "@/lib/admin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const au = await getUserFromRequest(req);
  if (!au) return jsonErr("Unauthorized", 401);
  if (!isAdminEmail(au.email)) return jsonErr("Forbidden", 403);

  const rows = await prisma.affiliatePayoutRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      affiliate: { select: { id: true, code: true, userId: true } },
    },
  });

  return jsonOk({ rows });
}
