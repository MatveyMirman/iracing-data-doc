import { NextRequest, NextResponse } from "next/server";
import { IracingAuthClient } from "@/lib/iracing-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, endpoint } = await req.json();
    if (!email || !password || !endpoint) {
      return NextResponse.json({ error: "Missing credentials or endpoint" }, { status: 400 });
    }
    const client = new IracingAuthClient(email, password);
    await client.signIn();
    const api = client.getApiClient();
    const res = await api.get(`/data/doc/${endpoint}`);
    return NextResponse.json({ doc: res.data });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load documentation" }, { status: 500 });
  }
}
