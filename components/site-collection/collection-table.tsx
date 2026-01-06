import { createSupabaseServerClient } from "@/integrations/supabase/server";

import CopyLinkButton from "./copy-link-button";
import DeleteCollectionButton from "./delete-collection-button";
import CollectionDetailsDialog from "./collection-details-dialog";
import CollectionDetailsContent from "./collection-details-content";

type Props = {
  siteId: string;
};

export default async function CollectionsTable({ siteId }: Props) {
  const supabase = await createSupabaseServerClient();

  const { data: collections } = await supabase
    .from("document_collections")
    .select(
      `
      id,
      name,
      expires_at,
      share_token,
      collection_documents(count),
      collection_workers(count),
      collection_worker_document_types(count)
    `,
    )
    .eq("construction_site_id", siteId)
    .order("expires_at");

  if (!collections?.length) {
    return (
      <div className="text-sm text-muted-foreground">No collections yet</div>
    );
  }

  return (
    <div className="rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3">Documents</th>
            <th className="p-3">Expires</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3 font-medium">{c.name}</td>
              <td className="p-3 text-center">
                {c.collection_documents?.[0]?.count ?? 0}
              </td>
              <td className="p-3">
                {new Date(c.expires_at).toLocaleDateString()}
              </td>
              <td className="p-3 flex gap-2 justify-end">
                <CollectionDetailsDialog
                  collectionId={c.id}
                  collectionName={c.name}
                >
                  <CollectionDetailsContent collectionId={c.id} />
                </CollectionDetailsDialog>
                <CopyLinkButton token={c.share_token} />
                <DeleteCollectionButton collectionId={c.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
