import { NextRequest } from "next/server";

import translationProxy from "./config/proxy/translation.proxy";

export default async function proxy(request: NextRequest) {
  const response = translationProxy(request);

  return response;
}

/*
 * Match all request paths except for the ones starting with:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - sitemap.xml, robots.txt (metadata files)
 */
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|sitemap.xml|robots.txt|.*\\..*).*)",
};
