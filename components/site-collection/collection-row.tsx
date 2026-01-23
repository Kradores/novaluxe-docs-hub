"use client";

import { ReactNode } from "react";
import { FileWarning } from "lucide-react";

import { useRole } from "@/components/role-provider";
import { CollectionRow } from "@/types/site-collection";
import { useZipJobProgress, ZipJob } from "@/hooks/use-zip-job-progress";
import { Badge } from "@/components/ui/badge";

import CollectionDetailsDialog from "./collection-details-dialog";
import CopyLinkButton from "./copy-link-button";
import { GenerateZipButton } from "./generate-zip-button";
import DeleteCollectionButton from "./delete-collection-button";
import { ZipProgress } from "./zip-progress";

type CollectionTableRowProps = {
  collection: CollectionRow;
  children?: ReactNode;
};

export default function CollectionTableRow({
  collection,
  children,
}: CollectionTableRowProps) {
  const { isUser } = useRole();
  const job = useZipJobProgress(collection.id);
  return (
    <tr key={collection.id} className="border-t">
      <td className="p-3 font-medium">{collection.name}</td>
      <td className="p-3 text-center">{collection.documents_count}</td>
      <td className="p-3 text-center">
        {new Date(collection.expires_at).toDateString()}
      </td>
      <td className="p-3">
        {!isUser && !job && (
          <div className="m-auto w-fit">
            <GenerateZipButton
              collectionId={collection.id}
              zipStatus={collection.zip_status}
            />
          </div>
        )}
        <div className="m-auto w-fit">
          <ZipProgress collectionId={collection.id} />
        </div>
      </td>
      <td className="p-3 flex gap-2 justify-center">
        <CollectionDetailsDialog
          collectionId={collection.id}
          collectionName={collection.name}
        >
          {children}
        </CollectionDetailsDialog>
        <CopyLinkButton token={collection.share_token} />
        <DeleteCollectionButton collectionId={collection.id} />
      </td>
    </tr>
  );
}
