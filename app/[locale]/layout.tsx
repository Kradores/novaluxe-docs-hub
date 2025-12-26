import type { Metadata } from "next";

import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ReactNode, use } from "react";
import { notFound } from "next/navigation";

import { routing } from "@/config/i18n/routing";
import { geistMono, geistSans } from "@/config/fonts";
import { Toaster } from "@/components/ui/sonner";

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

export default function RootLayout({ children, params }: LayoutProps) {
  const { locale } = use(params);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html suppressHydrationWarning lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          {children}
          <Toaster richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
