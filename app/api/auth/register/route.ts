import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signAccessToken, setAccessCookie } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email().transform((s) => s.trim().toLowerCase()),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = Body.parse(await req.json());

    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });
    if (existing) return jsonErr("User already exists", 400);

    const hash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash: hash,
      },
    });

    // ✅ РЕФЕРАЛЬНАЯ ПРИВЯЗКА
    try {
      const ref = req.cookies.get("aff_ref")?.value?.trim()?.toUpperCase();
      if (ref) {
        const aff = await prisma.affiliate.findUnique({
          where: { code: ref },
        });
        if (aff && aff.userId !== user.id) {
          await prisma.referral.upsert({
            where: { referredUserId: user.id },
            update: {},
            create: {
              affiliateId: aff.id,
              referredUserId: user.id,
            },
          });
        }
      }
    } catch {}

    const token = await signAccessToken({
      id: user.id,
      email: user.email,
    });

    const res = jsonOk({ ok: true });
    setAccessCookie(res, token);
    return res;
  } catch (e: any) {
    return jsonErr("Register failed", 400);
  }
}
