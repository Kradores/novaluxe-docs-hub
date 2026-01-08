"use client";

import { Trash2 } from "lucide-react";

import { deleteCollection } from "@/app/[locale]/construction-site/[id]/actions";
import { Button } from "@/components/ui/button";

export default function DeleteCollectionButton({
  collectionId,
}: {
  collectionId: string;
}) {
  return (
    <Button
      className="size-9"
      title="Delete documents collection"
      variant="destructive"
      onClick={() => deleteCollection(collectionId)}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
