import CreateTypeDialog from "@/components/company-document-types/create-type-dialog";
import DocumentTypesTable from "@/components/company-document-types/document-types-table";
import PageHeader from "@/components/page-header";
import { allRoutes } from "@/config/site";

import { getDocumentTypes } from "./actions";

export default async function Page() {
  const data = await getDocumentTypes();

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="space-y-10">
        <PageHeader
          action={<CreateTypeDialog />}
          backTo={allRoutes.home}
          translationKey="companyDocumentTypes"
        />
        <DocumentTypesTable data={data ?? []} />
      </div>
    </div>
  );
}
