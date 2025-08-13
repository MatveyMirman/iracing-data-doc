import { NextRequest, NextResponse } from "next/server";
import { getSessionAuthClient } from "@/lib/iracing-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, endpoint, params, method } = await req.json();
    if (!email || !password || !endpoint) {
      return NextResponse.json({ error: "Missing credentials or endpoint" }, { status: 400 });
    }
    const client = await getSessionAuthClient(email, password);
    // Support both endpoint paths and full URLs
    let url = endpoint.startsWith("http") ? endpoint : `https://members-ng.iracing.com/data/${endpoint}`;
    const httpMethod = (method || "GET").toUpperCase();
    let fetchOptions: any = { method: httpMethod, headers: {} };
    if (httpMethod === "GET") {
      if (!endpoint.startsWith("http") && params && Object.keys(params).length > 0) {
        const qs = new URLSearchParams(params).toString();
        url += `?${qs}`;
      }
    } else {
      if (params && Object.keys(params).length > 0) {
        fetchOptions.body = JSON.stringify(params);
        fetchOptions.headers = { "Content-Type": "application/json" };
      }
    }
    const resp = await client.fetch(url, fetchOptions);
    const data = await resp.json();
    return NextResponse.json({ result: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
