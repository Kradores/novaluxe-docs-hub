import { getTranslations } from "next-intl/server";

import { allRoutes } from "@/config/site";

export async function getRouteName(pathname: string) {
  const t = await getTranslations("nav");
  pathname = pathname.replace("/", "");

  const route = Object.entries(allRoutes).find(
    ([_, value]) => value.replace("/", "") === pathname,
  );

  if (route === undefined) {
    throw new Error(`${pathname} not found!`);
  }

  return t(route[0]);
}

export const runWithConcurrency = async <T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>,
) => {
  let index = 0;

  const runners = Array.from({ length: limit }, async () => {
    while (index < items.length) {
      const currentIndex = index++;
      await worker(items[currentIndex], currentIndex);
    }
  });

  await Promise.all(runners);
};
