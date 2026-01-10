import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signAccessToken, setAccessCookie } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const Body = z.object({
  email: z.string().email().transform((s) => s.trim().toLowerCase()),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = Body.parse(await req.json());

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) return jsonErr("Email already registered", 409);

    const passwordHash = await bcrypt.hash(body.password, 12);

    const user = await prisma.user.create({
      data: { email: body.email, passwordHash },
      select: { id: true, email: true, balanceCents: true, createdAt: true },
    });

    // --- affiliate referral (one-time) from cookie ---
    try {
      const refCode = req.cookies.get("aff_ref")?.value?.trim()?.toUpperCase();

      if (refCode) {
        const aff = await prisma.affiliate.findUnique({ where: { code: refCode } });

        // prevent self-ref and inactive affiliates
        if (aff && aff.isActive && aff.userId !== user.id) {
          await prisma.referral.upsert({
            where: { referredUserId: user.id },
            update: {},
            create: {
              affiliateId: aff.id,
              referredUserId: user.id,
            },
          });

          // очистим cookie, чтобы не “прилипало”
          cookies().set("aff_ref", "", {
            path: "/",
            maxAge: 0,
            sameSite: "lax",
          });
        }
      }
    } catch {
      // рефка не должна ломать регистрацию
    }
    // --- /affiliate referral ---

    const token = await signAccessToken({ id: user.id, email: user.email });
    setAccessCookie(token);

    return jsonOk({ user });
  } catch (e: any) {
    if (e?.name === "ZodError") return jsonErr("Invalid input", 422, e.issues);
    console.error(e);
    return jsonErr("Server error", 500);
  }
}
