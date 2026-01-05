import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { use } from "react";

import { routing } from "@/config/i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default function Layout({ children, params }: Props) {
  const { locale } = use(params);

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <section className="flex flex-col">
      <div className="flex flex-col max-w-8xl justify-center">{children}</div>
    </section>
  );
}
