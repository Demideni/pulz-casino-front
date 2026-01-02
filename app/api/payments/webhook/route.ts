import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonErr, jsonOk } from "@/lib/http";
import { passimpayVerifySignature } from "@/lib/passimpay";

export const runtime = "nodejs";

/**
 * PassimPay webhook handler (crypto deposits).
 *
 * PassimPay docs:
 * - Header: x-signature (HMAC-SHA256)
 * - Signature contract: platformId + ";" + JSON(body) + ";" + apiKey
 * - We use our local invoice id as orderId.
 */
export async function POST(req: NextRequest) {
  try {
    // Extra simple gate so random internet can't spam your webhook.
    const token = req.nextUrl.searchParams.get("token");
    if (!token || token !== process.env.PASSIMPAY_WEBHOOK_TOKEN) {
      return jsonErr("Unauthorized", 401);
    }

    const raw = await req.text();
    const receivedSig = req.headers.get("x-signature");

    const platformId = process.env.PASSIMPAY_PLATFORM_ID;
    const secret = process.env.PASSIMPAY_API_KEY;

    if (!platformId || !secret) {
      return jsonErr("PassimPay env missing: PASSIMPAY_PLATFORM_ID / PASSIMPAY_API_KEY", 500);
    }

    // Verify signature (required)
    const okSig = passimpayVerifySignature(Number(platformId), raw, secret, receivedSig);
    if (!okSig) return jsonErr("Bad signature", 401);

    const payload = JSON.parse(raw);

    // PassimPay webhook fields (docs):
    // type, platformId, paymentId, orderId, amount, txhash, addressFrom, addressTo, confirmations...
    const orderId: string | undefined = payload.orderId;
    const paymentId = payload.paymentId;
    const txhash = payload.txhash;
    const type = (payload.type || "").toString().toLowerCase();

    if (!orderId) return jsonErr("Missing orderId", 400);
    if (type && type !== "deposit") {
      // Ignore other webhook types safely
      return jsonOk({ ignored: true });
    }

    // Find local invoice by our externalId (we set externalId = invoice.id)
    const inv = await prisma.paymentInvoice.findFirst({ where: { externalId: orderId } });
    if (!inv) return jsonErr("Invoice not found", 404);

    // If already paid, idempotent ok
    if (inv.status === "PAID") return jsonOk({ ignored: true });

    // Mark invoice paid and credit user atomically
    await prisma.$transaction(async (tx) => {
      await tx.paymentInvoice.update({
        where: { id: inv.id },
        data: { status: "PAID" },
      });

      await tx.user.update({
        where: { id: inv.userId },
        data: { balanceCents: { increment: inv.amountCents } },
      });

      await tx.transaction.create({
        data: {
          userId: inv.userId,
          type: "DEPOSIT",
          amountCents: inv.amountCents,
          meta: { provider: "PassimPay", paymentId, txhash, orderId },
        },
      });
    });

    return jsonOk({ credited: true });
  } catch (e) {
    console.error(e);
    return jsonErr("Server error", 500);
  }
}
