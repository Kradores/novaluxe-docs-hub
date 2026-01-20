import { NextRequest, NextResponse } from "next/server";

import { AUTH_ROUTES, PROTECTED_ROUTE_PREFIXES } from "@/config/auth/routes";
import { allRoutes } from "@/config/site";
import { stripLocale } from "@/lib/utils";

type GuardParams = {
  request: NextRequest;
  user: unknown | null;
};

export function authGuard({ request, user }: GuardParams) {
  const pathname = stripLocale(request.nextUrl.pathname);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Unauthenticated redirect to login
  if (!user && !isAuthRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = allRoutes.login;
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated redirect to app
  if (user && isAuthRoute) {
    const appUrl = request.nextUrl.clone();
    appUrl.pathname = allRoutes.home;
    return NextResponse.redirect(appUrl);
  }

  return null;
}
