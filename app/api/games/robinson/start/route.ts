import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { amount } = await req.json();

  // TODO: проверить авторизацию, списать amount с баланса, создать round
  return NextResponse.json({
    balance: 1000 - Number(amount || 0),
    roundId: crypto.randomUUID(),
  });
}
