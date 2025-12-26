import type { Metadata } from "next";
import "../globals.css";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { ReactNode, use } from "react";
import { routing } from "@/config/i18n/routing";
import { notFound } from "next/navigation";
import { geistMono, geistSans } from "@/config/fonts";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Novaluxe Docs Hub",
  description: "Novaluxe documents management system.",
  icons: {
    icon: "/favicon.png"
  }
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
    <html lang={locale} suppressHydrationWarning>
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
