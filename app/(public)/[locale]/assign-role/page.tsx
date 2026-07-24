"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { assignRole } from "./actions";
import { allRoutes } from "@/config/site";
import { redirect } from "@/config/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Spinner } from "@/components/ui/spinner";

export default function Page() {
  const locale = useLocale();
  const t = useTranslations("common");
  useEffect(() => {
    const run = async () => {
      const supabase = createSupabaseBrowserClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        return;
      }

      await assignRole(user.id, user.email);
      redirect({ href: allRoutes.home, locale });
    };

    run();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-dvh gap-4">
      <h1 className="font-serif text-xl sm:text-2xl">{t("assignRole")}</h1>
      <Spinner className="size-10" />
    </div>
  );
}