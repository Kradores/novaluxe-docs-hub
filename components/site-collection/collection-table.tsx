import { createSupabaseServerClient } from "@/integrations/supabase/server";

import CopyLinkButton from "./copy-link-button";
import DeleteCollectionButton from "./delete-collection-button";
import CollectionDetailsDialog from "./collection-details-dialog";
import CollectionDetailsContent from "./collection-details-content";
import { GenerateZipButton } from "./generate-zip-button";

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
      zip_status,
      documents_count
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
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-3 font-medium">{c.name}</td>
              <td className="p-3 text-center">{c.documents_count}</td>
              <td className="p-3 text-center">
                {new Date(c.expires_at).toLocaleDateString()}
              </td>
              <td className="p-3 flex gap-2 justify-center">
                <CollectionDetailsDialog
                  collectionId={c.id}
                  collectionName={c.name}
                >
                  <CollectionDetailsContent collectionId={c.id} />
                </CollectionDetailsDialog>
                <CopyLinkButton token={c.share_token} />
                <GenerateZipButton
                  collectionId={c.id}
                  zipStatus={c.zip_status}
                />
                <DeleteCollectionButton collectionId={c.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
