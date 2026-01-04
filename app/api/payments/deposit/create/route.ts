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

// NOTE: This endpoint creates a local invoice record.
// You will plug PassimPay API call where marked below.
export async function POST(req: NextRequest) {
  const au = await getUserFromRequest(req);
  if (!au) return jsonErr("Unauthorized", 401);

  try {
    const body = Body.parse(await req.json());
    const amountCents = toCents(body.amountUsd);

    // Create local invoice first
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

    // TODO (PassimPay):
    // 1) Call PassimPay "create invoice" endpoint here
    // 2) Save externalId + checkoutUrl to this invoice
    //
    // Example:
    // const r = await fetch(process.env.PASSIMPAY_BASE_URL + "/invoices", { ... })
    // const data = await r.json()
    // await prisma.paymentInvoice.update({ where:{id: invoice.id}, data:{ externalId: data.id, checkoutUrl: data.checkoutUrl } })

    return jsonOk({ invoice });
  } catch (e: any) {
    if (e?.name === "ZodError") return jsonErr("Invalid input", 422, e.issues);
    console.error(e);
    return jsonErr("Server error", 500);
  }
}
