export const locales = ["es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "es";

export function isLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function buildLocale(countryCode: string): Locale | undefined {
  const locale = locales.find((value) => {
    const [, region] = value.split("-");

    return countryCode === region;
  });

  try {
    new Intl.NumberFormat(locale);

    return locale;
  } catch {
    return undefined;
  }
}
