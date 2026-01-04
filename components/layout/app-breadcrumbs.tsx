"use client";

import React from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import Link from "@/components/link";
import { allRoutes, siteName } from "@/config/site";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppBreadcrumbs() {
  const { breadcrumbs, isLoading } = useBreadcrumbs();

  if (isLoading) {
    return <Skeleton className="h-5 w-75 rounded-full" />;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link href={allRoutes.home}>{siteName}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((bc, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <React.Fragment key={bc.href}>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                {isLast ? (
                  <BreadcrumbPage>{bc.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={bc.href}>{bc.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
