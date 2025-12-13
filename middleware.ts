import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCK = [
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/wordpress",
  "/setup-config.php",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // режем wp-сканеры
  if (BLOCK.some((p) => pathname === p || pathname.startsWith(p + "/") || pathname.endsWith(p))) {
    // 404 (можно 410)
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.next();
}

// чтобы middleware не трогал next/static и картинки
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
