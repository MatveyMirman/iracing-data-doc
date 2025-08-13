import { NextRequest, NextResponse } from "next/server";
import { IracingAuthClient } from "@/lib/iracing-auth";

function extractEndpoints(obj: any, path: string[] = []): { name: string; url: string }[] {
  let endpoints: { name: string; url: string }[] = [];
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (obj[key].link && typeof obj[key].link === "string") {
        // Compose endpoint name and url
        const url = obj[key].link.replace("https://members-ng.iracing.com/data/", "data/");
        endpoints.push({
          name: [...path, key].join("/"),
          url,
        });
      }
      // Recurse into nested objects
      endpoints = endpoints.concat(extractEndpoints(obj[key], [...path, key]));
    }
  }
  return endpoints;
}

export async function GET(req: NextRequest) {
  try {
    const res = await fetch("https://members-ng.iracing.com/data/doc");
    const data = await res.json();
    const endpoints = extractEndpoints(data);
    return NextResponse.json({ endpoints });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load endpoints" }, { status: 500 });
  }
}

// Accept POST with { email, password }
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }
    const client = new IracingAuthClient(email, password);
    await client.signIn();
    const api = client.getApiClient();
    const res = await api.get("/data/doc");
    const data = res.data;
    const endpoints = extractEndpoints(data);
    return NextResponse.json({ endpoints });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to load endpoints" }, { status: 500 });
  }
}
