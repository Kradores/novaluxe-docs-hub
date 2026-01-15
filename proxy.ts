import { NextRequest, NextResponse } from "next/server";

import { authGuard } from "@/lib/auth/guard";

import translationProxy from "./config/proxy/translation.proxy";
import { createSupabaseProxyClient } from "./integrations/supabase/proxy";

export default async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createSupabaseProxyClient(request, response);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const guardResponse = authGuard({ request, user });
  if (guardResponse) return guardResponse;

  const i18nResponse = await translationProxy(request);

  response.cookies.getAll().forEach((cookie) => {
    i18nResponse.cookies.set(cookie);
  });

  return i18nResponse;
}

export const config = {
  matcher: [
    "/((?!api|trpc|_next/static|_next/image|_vercel|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
