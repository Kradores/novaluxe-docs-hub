import { NextRequest } from "next/server";

import translationProxy from "./config/proxy/translation.proxy";
import { updateSession } from "./integrations/supabase/proxy";

export default async function proxy(request: NextRequest) {
  // define both to make them run in parallel
  const authPromise = updateSession(request);
  const i18nPromise = translationProxy(request);

  const authResponse = await authPromise;
  const i18nResponse = await i18nPromise;

  authResponse.cookies.getAll().forEach((cookie) => {
    i18nResponse.cookies.set(cookie);
  });

  return i18nResponse;
}

/*
 * Next-Intl matcher:
 * - api (API routes)
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - sitemap.xml, robots.txt (metadata files)
 */
// export const config = {
//   matcher: "/((?!api|trpc|_next|_vercel|sitemap.xml|robots.txt|.*\\..*).*)",
// };

// Supabase Auth matcher
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * Feel free to modify this pattern to include more paths.
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }
export const config = {
  matcher: [
    "/((?!api|trpc|_next/static|_next/image|_vercel|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};

