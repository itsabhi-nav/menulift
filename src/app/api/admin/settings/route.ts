import { NextResponse } from "next/server";
import { getPersonalSettings, savePersonalSettings } from "@/lib/store";
import { isAdminCookie, readJson, sameOrigin } from "@/lib/server-utils";

function authed(req: Request) {
  return isAdminCookie(req.headers.get("cookie")?.match(/ml_admin=([^;]+)/)?.[1]);
}

export async function GET(req: Request) {
  if (!authed(req)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  return NextResponse.json(await getPersonalSettings());
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  if (!authed(req)) return NextResponse.json({ error: "unauthorised" }, { status: 401 });
  const body = await readJson(req, 20000);
  if (!body) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  return NextResponse.json(await savePersonalSettings(body));
}
