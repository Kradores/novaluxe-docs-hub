import { getTranslations } from "next-intl/server";

import CompanyDocumentsTable from "@/components/company-documents/company-documents-table";
import UploadDialog from "@/components/company-documents/upload-dialog";
import PageHeader from "@/components/page-header";
import { allRoutes } from "@/config/site";

import { getCompanyDocuments } from "./actions";

export default async function Page() {
  const t = await getTranslations("companyDocuments");
  const { documents, types } = await getCompanyDocuments();
  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="space-y-10">
        <PageHeader
          action={<UploadDialog documentTypes={types ?? []} />}
          backTo={allRoutes.home}
          subtitle={t.has("subtitle") && t("subtitle")}
          title={t("title")}
        />
        <CompanyDocumentsTable documents={documents ?? []} />
      </div>
    </div>
  );
}
