import { notFound } from "next/navigation";

import PageHeader from "@/components/page-header";
import { allRoutes } from "@/config/site";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import CollectionsTable from "@/components/site-collection/collection-table";
import CreateCollectionData from "@/components/site-collection/create-collection-data";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: site } = await supabase
    .from("construction_sites")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!site) notFound();

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="space-y-10">
        <PageHeader
          action={<CreateCollectionData siteId={site.id} />}
          backTo={allRoutes.constructionSite}
          title={site.name}
        />
        <CollectionsTable siteId={site.id} />
      </div>
    </div>
  );
}
