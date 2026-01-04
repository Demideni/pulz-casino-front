import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { jsonErr, jsonOk } from "@/lib/http";

export const runtime = "nodejs";

const Body = z.object({
  amountUsd: z.number().positive(), // USD amount (we'll convert to cents)
  currency: z.string().optional().default("USDT"),
});

function toCents(amountUsd: number) {
  return Math.round(amountUsd * 100);
}

export async function POST(req: NextRequest) {
  const au = await getUserFromRequest(req);
  if (!au) return jsonErr("Unauthorized", 401);

  try {
    const body = Body.parse(await req.json());
    const amountCents = toCents(body.amountUsd);

    // 1) Create local invoice first
    const invoice = await prisma.paymentInvoice.create({
      data: {
        userId: au.id,
        provider: "PassimPay",
        currency: body.currency,
        amountCents,
        status: "PENDING",
      },
      select: { id: true, amountCents: true, currency: true, status: true, checkoutUrl: true },
    });

    // 2) Call PassimPay create-order endpoint
    const platformId = process.env.PASSIMPAY_PLATFORM_ID;
    const apiKey = process.env.PASSIMPAY_API_KEY;
    if (!platformId || !apiKey) return jsonErr("PassimPay env missing", 500);

    // Build absolute URLs from current deployment origin (works for Render previews too)
    const origin = req.nextUrl.origin;
    const webhookToken = process.env.PASSIMPAY_WEBHOOK_TOKEN;
    const callbackUrl = webhookToken
      ? `${origin}/api/payments/webhook?token=${encodeURIComponent(webhookToken)}`
      : `${origin}/api/payments/webhook`;

    const r = await fetch("https://api.passimpay.io/v2/createorder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        platformId,
        // Use our local invoice id as orderId for easy reconciliation
        orderId: invoice.id,
        amount: body.amountUsd,
        currency: body.currency,
        successUrl: `${origin}/cashier?paid=1`,
        failUrl: `${origin}/cashier?fail=1`,
        callbackUrl,
      }),
    });

    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error("PassimPay createorder failed", data);
      return jsonErr(data?.message || data?.error || "PassimPay error", 502, data);
    }

    const checkoutUrl =
      data?.checkoutUrl ||
      data?.data?.checkoutUrl ||
      data?.result?.checkoutUrl ||
      data?.invoice?.checkoutUrl ||
      data?.url;

    // External id returned by provider (if any)
    const externalId = data?.invoiceId || data?.id || data?.data?.id || data?.result?.id;

    if (!checkoutUrl) {
      console.error("PassimPay did not return checkoutUrl", data);
      // Still return invoice (front will show error), but persist externalId if present
      await prisma.paymentInvoice.update({
        where: { id: invoice.id },
        data: { externalId: externalId || invoice.id },
        select: { id: true },
      });
      return jsonOk({ invoice: { ...invoice, externalId: externalId || invoice.id } });
    }

    // 3) Persist provider fields
    const updated = await prisma.paymentInvoice.update({
      where: { id: invoice.id },
      data: {
        externalId: externalId || invoice.id,
        checkoutUrl,
      },
      select: { id: true, amountCents: true, currency: true, status: true, checkoutUrl: true, externalId: true },
    });

    return jsonOk({ invoice: updated });
  } catch (e: any) {
    if (e?.name === "ZodError") return jsonErr("Invalid input", 422, e.issues);
    console.error(e);
    return jsonErr("Server error", 500);
  }
}
