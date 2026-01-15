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

    const existing = await prisma.user.findUnique({
      where: { email: body.email },
      select: { id: true },
    });
    if (existing) return jsonErr("Email already registered", 400);

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        email: body.email,
        passwordHash,
      },
      select: { id: true, email: true },
    });

    // если юзер пришёл по рефке — запишем Referral
    const refCode = req.cookies.get("aff_ref")?.value;
    if (refCode) {
      const aff = await prisma.affiliate.findUnique({
        where: { code: refCode },
        select: { id: true, isActive: true },
      });

      if (aff?.isActive) {
        try {
          await prisma.referral.create({
            data: {
              affiliateId: aff.id,
              referredUserId: user.id,
            },
          });
        } catch {
          // ignore (already referred)
        }
      }

      // важно: чистим cookie, чтобы этот ref не "прилип" к следующей регистрации на устройстве
      cookies().set("aff_ref", "", {
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
      });
    }

    const token = await signAccessToken({ id: user.id, email: user.email });
   const res = jsonOk({ user });
setAccessCookie(res, token);
return res;

  } catch (e: any) {
    if (e?.name === "ZodError") return jsonErr("Invalid input", 422, e.issues);
    console.error(e);
    return jsonErr("Server error", 500);
  }
}
