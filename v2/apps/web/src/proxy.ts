import { NextResponse, type NextRequest } from "next/server";

import { LOCALE_HEADER, PATH_HEADER } from "@/lib/i18n/config";

/**
 * English lives at the unprefixed addresses and French under /fr. French requests are rewritten to
 * the same routes, with the language passed along in a request header.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const french = pathname === "/fr" || pathname.startsWith("/fr/");
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, french ? "fr" : "en");
  headers.set(PATH_HEADER, french ? pathname.slice(3) || "/" : pathname);

  if (!french) return NextResponse.next({ request: { headers } });

  const url = request.nextUrl.clone();
  url.pathname = pathname.slice(3) || "/";
  return NextResponse.rewrite(url, { request: { headers } });
}

export const config = {
  matcher: ["/((?!admin|v1|_next|uploads|icon.svg|robots.txt|sitemap.xml|.*\\.[a-z0-9]+$).*)"],
};
