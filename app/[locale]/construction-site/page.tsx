import { getTranslations } from "next-intl/server";

import PageHeader from "@/components/page-header";
import { allRoutes } from "@/config/site";
import ConstructionSitesTable from "@/components/construction-sites/construction-sites-table";
import CreateDialog from "@/components/construction-sites/create-dialog";

import { getConstructionSites } from "./actions";

export default async function Page() {
  const [t, data] = await Promise.all([
    getTranslations("constructionSite"),
    getConstructionSites(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        action={<CreateDialog />}
        backTo={allRoutes.home}
        subtitle={t.has("subtitle") && t("subtitle")}
        title={t("title")}
      />
      <ConstructionSitesTable items={data ?? []} />
    </div>
  );
}
