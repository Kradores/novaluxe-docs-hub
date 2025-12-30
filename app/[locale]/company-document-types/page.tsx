import CreateTypeDialog from "@/components/company-document-types/create-type-dialog";
import DocumentTypesTable from "@/components/company-document-types/document-types-table";
import PageHeader from "@/components/page-header";
import { allRoutes } from "@/config/site";
import { createSupabaseServerClient } from "@/integrations/supabase/server";

export default async function Page() {
  const supabase = await createSupabaseServerClient();

  const { data } = await supabase
    .from("company_document_types")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="space-y-10">
        <PageHeader
          backTo={allRoutes.home}
          translationKey="companyDocumentTypes"
          action={<CreateTypeDialog />}
        />
        <DocumentTypesTable data={data ?? []} />
      </div>
    </div>
  );
}
