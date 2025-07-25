import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authData = await req.json();
  const { user, accessToken } = authData;

  if (!user?.uid || !accessToken) {
    return NextResponse.json({ error: "invalid data" }, { status: 400 });
  }
  console.log("Pi user authenticated:", user);
  return NextResponse.json({ uid: user.uid });
}
