import type { Metadata } from "next";

import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { notFound } from "next/navigation";

import { routing } from "@/config/i18n/routing";
import { inter, playfairDisplay } from "@/config/fonts";
import { Toaster } from "@/components/ui/sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import AppBreadcrumbs from "@/components/layout/app-breadcrumbs";
import { RoleProvider } from "@/components/role-provider";
import { getUserRoleName } from "@/lib/server/user";

export const metadata: Metadata = {
  title: "Novaluxe Docs Hub",
  description: "Novaluxe documents management system.",
  icons: {
    icon: "/favicon.png",
  },
};

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  const role = await getUserRoleName();

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html suppressHydrationWarning lang={locale}>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <RoleProvider role={role}>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    className="mr-2 data-[orientation=vertical]:h-4"
                    orientation="vertical"
                  />
                  <AppBreadcrumbs />
                </header>
                <main>{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </RoleProvider>
          <Toaster richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
