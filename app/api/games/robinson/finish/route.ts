import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { multiplier, amount } = await req.json(); // amount можешь не передавать если не хочешь

  // TODO: рассчитать win на сервере и начислить пользователю
  const win = 0; // заглушка
  return NextResponse.json({
    balance: 1000 + win,
    win,
  });
}
