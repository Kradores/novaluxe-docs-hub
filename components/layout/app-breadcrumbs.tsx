"use client";

import React from "react";
import { useTranslations } from "next-intl";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "@/config/i18n/navigation";
import { allRoutes, siteName } from "@/config/site";

import Link from "../link";

export default function AppBreadcrumbs() {
  const t = useTranslations("nav");
  const breadcrumbs = usePathname()
    .split("/")
    .filter((bc) => bc !== "");

  const getName = (pathname: string) => {
    const route = Object.entries(allRoutes).find(
      ([_, value]) => value.split("/").at(-1) === pathname.split("/").at(-1),
    );

    if (route === undefined) {
      throw new Error(`${pathname} not found!`);
    }

    return t(route[0]);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href={allRoutes.home}>{siteName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((bc, index) => {
          if (breadcrumbs.length - 1 === index) {
            return (
              <React.Fragment key={bc}>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getName(bc)}</BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            );
          }
          return (
            <React.Fragment key={bc}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href={bc}>{getName(bc)}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
