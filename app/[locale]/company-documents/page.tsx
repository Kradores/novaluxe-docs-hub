import CompanyDocumentsTable from "@/components/company-documents/company-documents-table";
import UploadDialog from "@/components/company-documents/upload-dialog";
import PageHeader from "@/components/page-header";
import { allRoutes } from "@/config/site";
import { createSupabaseServerClient } from "@/integrations/supabase/server";

export default async function Page() {
  const supabase = await createSupabaseServerClient();

  const [{ data: documents }, { data: types }] = await Promise.all([
    supabase
      .from("company_documents")
      .select("*, company_document_types(id, name)")
      .order("created_at", { ascending: false }),

    supabase
      .from("company_document_types")
      .select<string, { id: string; name: string }>(`
        id, 
        name, 
        company_documents!left(id)
      `)
      .is("company_documents", null)
      .order("name"),
  ]);
  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="space-y-10">
        <PageHeader
          action={<UploadDialog documentTypes={types ?? []} />}
          backTo={allRoutes.home}
          translationKey="companyDocuments"
        />
        <CompanyDocumentsTable documents={documents ?? []} />
      </div>
    </div>
  );
}
