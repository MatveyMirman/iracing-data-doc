import { NextRequest, NextResponse } from "next/server";
import { IracingAuthClient } from "@/lib/iracing-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }
    const client = new IracingAuthClient(email, password);
    await client.signIn();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 401 });
  }
}
