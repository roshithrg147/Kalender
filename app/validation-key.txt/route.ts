import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.VALIDATION_KEY;
  if (!key) {
    return new NextResponse("VALIDATION_KEY not set", { status: 500 });
  }
  return new NextResponse(`KEY:{${key}}`, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
