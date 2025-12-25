import { clearAccessCookie } from "@/lib/auth";
import { jsonOk } from "@/lib/http";

export const runtime = "nodejs";

export async function POST() {
  clearAccessCookie();
  return jsonOk({ loggedOut: true });
}
