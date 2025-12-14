import { NextResponse } from "next/server";

export async function GET() {
  // TODO: заменить на реальный баланс пользователя из казино
  return NextResponse.json({ balance: 1000 });
}
