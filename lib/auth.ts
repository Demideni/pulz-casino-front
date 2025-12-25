import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

const encoder = new TextEncoder();

function secretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return encoder.encode(secret);
}

export type AuthUser = { id: string; email: string };

export const ACCESS_COOKIE = "PULZ_AT";

export async function signAccessToken(user: AuthUser) {
  // 7 days for MVP; you can shorten later
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  return new SignJWT({ sub: user.id, email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secretKey());
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secretKey());
  const sub = payload.sub;
  const email = payload.email;
  if (!sub || typeof sub !== "string") throw new Error("Invalid token sub");
  if (!email || typeof email !== "string") throw new Error("Invalid token email");
  return { id: sub, email };
}

export function setAccessCookie(token: string) {
  cookies().set(ACCESS_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAccessCookie() {
  cookies().set(ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 0,
  });
}

export async function getUserFromRequest(req: NextRequest): Promise<AuthUser | null> {
  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}
