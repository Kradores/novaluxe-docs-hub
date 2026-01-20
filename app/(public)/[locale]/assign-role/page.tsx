import { getTranslations } from "next-intl/server";

import { Spinner } from "@/components/ui/spinner";
import { redirect } from "@/config/i18n/navigation";
import { allRoutes } from "@/config/site";
import { handleErrorToast } from "@/lib/utils";

import { assignRole } from "./actions";

type Props = {
  params: { locale: string };
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("common");

  await assignRole();
  redirect({ href: allRoutes.home, locale });

  return (
    <div className="flex flex-col items-center justify-center h-dvh gap-4">
      <h1 className="font-serif text-xl sm:text-2xl">{t("assignRole")}</h1>
      <Spinner className="size-10" />
    </div>
  );
}
