import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

import { routing } from "../i18n/routing";

export default async function translationProxy(request: NextRequest) {
  const handleI18nRouting = createMiddleware(routing);
  const response = handleI18nRouting(request);

  return response;
}
