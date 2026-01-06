"use client";

import { deleteCollection } from "@/app/[locale]/construction-site/[id]/actions";
import { Button } from "@/components/ui/button";

export default function DeleteCollectionButton({
  collectionId,
}: {
  collectionId: string;
}) {
  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={() => deleteCollection(collectionId)}
    >
      Delete
    </Button>
  );
}
