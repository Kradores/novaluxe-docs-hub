import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { usePathname } from "@/config/i18n/navigation";
import { allRoutes, BreadcrumbRouteType } from "@/config/site";
import { breadcrumbConfig } from "@/config/breadcrumbs";

export function useBreadcrumbs() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function resolveBreadcrumbs() {
      setIsLoading(true);
      const segments = pathname.split("/").filter(Boolean);

      try {
        const resolved = await Promise.all(
          segments.map(async (s, index) => {
            const lookFor = s.split("/").at(-1);

            if (lookFor === undefined) {
              throw new Error(`${lookFor} not found!`);
            }

            // 1. Find if the segment matches a static route
            let routeEntry = Object.entries(allRoutes).find(
              ([_, value]) => value.split("/").at(-1) === lookFor,
            );

            let isDynamic = false;

            // 2. If not found, check if it's a dynamic child of the previous segment
            if (!routeEntry && index > 0) {
              const prevSegment = segments[index - 1];
              routeEntry = Object.entries(allRoutes).find(
                ([_, value]) => value.split("/").at(-1) === prevSegment,
              );
              if (routeEntry) isDynamic = true;
            }

            if (!routeEntry) return null;

            const routeKey = routeEntry[0] as BreadcrumbRouteType;
            const config = breadcrumbConfig[routeKey];

            if (isDynamic && config.dynamic) {
              const label = await config.dynamic.getLabel(lookFor);
              return {
                label: label, // Assuming getLabel returns the final string or translation key
                href: config.dynamic.getHref(lookFor),
              };
            }

            return {
              label: t(config.staticLabel),
              href: config.href,
            };
          }),
        );

        // Filter out nulls if a segment didn't match any route
        setBreadcrumbs(
          resolved.filter(
            (b): b is { label: string; href: string } => b !== null,
          ),
        );
      } catch {
      } finally {
        setIsLoading(false);
      }
    }

    resolveBreadcrumbs();
  }, [pathname, t]);

  return { breadcrumbs, isLoading };
}
