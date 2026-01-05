import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

function parseDate(s: string | null) {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export async function GET(req: NextRequest) {
  const au = await getUserFromRequest(req);
  if (!au) return jsonErr("Unauthorized", 401);

  const aff = await prisma.affiliate.findUnique({ where: { userId: au.id } });
  if (!aff) return jsonErr("Affiliate not found", 404);

  const from = parseDate(req.nextUrl.searchParams.get("from")) || new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const to = parseDate(req.nextUrl.searchParams.get("to")) || new Date();

  const [clicks, referrals, earningsAgg] = await Promise.all([
    prisma.affiliateClick.count({ where: { affiliateId: aff.id, createdAt: { gte: from, lte: to } } }),
    prisma.referral.count({ where: { affiliateId: aff.id, createdAt: { gte: from, lte: to } } }),
    prisma.affiliateEarning.aggregate({
      where: { affiliateId: aff.id, createdAt: { gte: from, lte: to } },
      _sum: { amountCents: true },
    }),
  ]);

  const referredUsers = await prisma.referral.findMany({
    where: { affiliateId: aff.id },
    select: { referredUserId: true },
  });
  const referredIds = referredUsers.map((r) => r.referredUserId);

  const depositsAgg = referredIds.length
    ? await prisma.transaction.aggregate({
        where: { userId: { in: referredIds }, type: "DEPOSIT", createdAt: { gte: from, lte: to } },
        _sum: { amountCents: true },
        _count: { _all: true },
      })
    : { _sum: { amountCents: 0 }, _count: { _all: 0 } };

  return jsonOk({
    affiliate: { id: aff.id, code: aff.code, revshareBps: aff.revshareBps, isActive: aff.isActive },
    range: { from: from.toISOString(), to: to.toISOString() },
    clicks,
    referrals,
    deposits: { count: (depositsAgg as any)._count._all, sumCents: (depositsAgg as any)._sum.amountCents || 0 },
    earnings: { sumCents: earningsAgg._sum.amountCents || 0 },
  });
}
