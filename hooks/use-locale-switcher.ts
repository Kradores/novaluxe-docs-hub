import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/config/i18n/navigation";
import { Locale } from "@/config/locales";

export default function useLocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function setLocale(locale: Locale) {
    localStorage.setItem("locale", locale);
    router.replace(pathname, { locale: locale });
  }

  return {
    locale,
    setLocale,
  };
}
