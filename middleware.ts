import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCK = [
  "/wp-admin",
  "/wp-login.php",
  "/xmlrpc.php",
  "/wordpress",
  "/setup-config.php",
];

const PROTECTED_PAGES = ["/account", "/cashier"];
const PROTECTED_API_PREFIXES = ["/api/me", "/api/transactions", "/api/payments", "/api/games/robinson"];

const ACCESS_COOKIE = "PULZ_AT";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // block wp-scanners
  if (
    BLOCK.some(
      (p) => pathname === p || pathname.startsWith(p + "/") || pathname.endsWith(p)
    )
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const hasAuth = Boolean(req.cookies.get(ACCESS_COOKIE)?.value);

  // protect pages
  if (PROTECTED_PAGES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!hasAuth) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  // protect API
  if (PROTECTED_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!hasAuth) {
      return NextResponse.json({ ok: false, error: { message: "Unauthorized" } }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
