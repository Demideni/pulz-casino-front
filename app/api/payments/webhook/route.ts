import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { jsonErr, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

/**
 * PassimPay webhook handler (crypto deposits).
 *
 * You MUST verify the signature based on PassimPay docs.
 * DO NOT credit balance without signature verification.
 */
export async function POST(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
if (!token || token !== process.env.PASSIMPAY_WEBHOOK_TOKEN) {
  return jsonErr("Unauthorized", 401);
}
    const raw = await req.text();

    // TODO: verify webhook signature (example header name; replace with real)
    // const sig = req.headers.get("x-passimpay-signature");
    // if (!verify(raw, sig, process.env.PASSIMPAY_WEBHOOK_SECRET)) return jsonErr("Bad signature", 401);

    const payload = JSON.parse(raw);

    // Expected fields (replace with real):
    // payload.invoiceId, payload.status, payload.amountUsd
    const externalId = payload.invoiceId || payload.id;
    const status = (payload.status || "").toUpperCase();

    if (!externalId) return jsonErr("Missing invoiceId", 400);

    // Find local invoice by externalId
    const inv = await prisma.paymentInvoice.findFirst({ where: { externalId } });
    if (!inv) return jsonErr("Invoice not found", 404);

    if (inv.status === "PAID") {
      return jsonOk({ ignored: true });
    }

    if (status !== "PAID" && status !== "SUCCESS") {
      // update status anyway
      await prisma.paymentInvoice.update({
        where: { id: inv.id },
        data: { status: status === "EXPIRED" ? "EXPIRED" : "FAILED" },
      });
      return jsonOk({ updated: true });
    }

    // Mark invoice as paid and credit user atomically
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
          meta: { provider: "PassimPay", externalId },
        },
      });
    });

    return jsonOk({ credited: true });
  } catch (e) {
    console.error(e);
    return jsonErr("Server error", 500);
  }
}
