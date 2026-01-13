"use client";

import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { deleteCollection } from "@/app/[locale]/construction-site/[id]/actions";
import { Button } from "@/components/ui/button";

export default function DeleteCollectionButton({
  collectionId,
}: {
  collectionId: string;
}) {
  const t = useTranslations("constructionSiteDetail");
  return (
    <Button
      className="size-9"
      title={t("delete")}
      variant="destructive"
      onClick={() => deleteCollection(collectionId)}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
