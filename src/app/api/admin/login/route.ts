import { NextResponse } from "next/server";
import { clientIp, makeAdminCookie, passwordMatches, passwordTooWeak, rateLimited, sameOrigin } from "@/lib/server-utils";

export async function POST(req: Request) {
  const base = new URL(req.url);
  // a relative address, so it works on localhost, on the phone over Wi-Fi and on the live domain alike
  const back = (q = "") => new NextResponse(null, { status: 303, headers: { location: `/admin${q}` } });
  if (!sameOrigin(req)) return back("?e=1");
  if (rateLimited(`login:${clientIp(req)}`, 6)) return back("?e=wait");
  if (passwordTooWeak(req)) return back("?e=weak");
  const form = await req.formData().catch(() => null);
  const pw = String(form?.get("password") ?? "").slice(0, 200);
  if (!passwordMatches(pw)) {
    await new Promise((r) => setTimeout(r, 600)); // slows down guessing
    return back("?e=1");
  }
  const session = makeAdminCookie();
  if (!session) return back("?e=1");
  const res = back();
  res.cookies.set("ml_admin", session.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: base.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https",
    path: "/",
    maxAge: session.maxAge,
  });
  return res;
}

export async function DELETE(req: Request) {
  if (!sameOrigin(req)) return new NextResponse("Forbidden", { status: 403 });
  const res = new NextResponse(null, { status: 303, headers: { location: "/admin" } });
  res.cookies.delete("ml_admin");
  return res;
}
