import { getTranslations } from "next-intl/server";

import CreateTypeDialog from "@/components/worker-document-types/create-type-dialog";
import DocumentTypesTable from "@/components/worker-document-types/document-types-table";
import PageHeader from "@/components/page-header";
import { allRoutes } from "@/config/site";

import { getDocumentTypes } from "./actions";

export default async function Page() {
  const t = await getTranslations("workerDocumentTypes");
  const data = await getDocumentTypes();

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="space-y-10">
        <PageHeader
          action={<CreateTypeDialog />}
          backTo={allRoutes.home}
          subtitle={t.has("subtitle") && t("subtitle")}
          title={t("title")}
        />
        <DocumentTypesTable data={data ?? []} />
      </div>
    </div>
  );
}
