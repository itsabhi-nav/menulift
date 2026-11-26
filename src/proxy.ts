import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * English is the default and has no prefix: /pricing is served from /en/pricing behind the scenes.
 * Hindi lives at /hi. A visible /en address is sent back to the clean one.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (pathname === "/hi" || pathname.startsWith("/hi/")) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
