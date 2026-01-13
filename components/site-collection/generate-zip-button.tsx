"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Archive } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { triggerGenerateCollectionZip } from "@/app/[locale]/construction-site/[id]/actions";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  collectionId: string;
  zipStatus: "idle" | "processing" | "ready" | "failed";
};

export function GenerateZipButton({ collectionId, zipStatus }: Props) {
  const t = useTranslations("constructionSiteDetail.generate");
  const [isPending, startTransition] = useTransition();

  const disabled = zipStatus === "processing" || isPending;

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        await triggerGenerateCollectionZip(collectionId);
        toast.success(t("success"));
      } catch {
        toast.error(t("error"));
      }
    });
  };

  if (zipStatus === "ready") {
    return <></>;
  }

  return (
    <Button
      className="size-9"
      disabled={disabled}
      title={disabled ? t("buttonTitleInProgress") : t("buttonTitle")}
      onClick={handleGenerate}
    >
      {disabled ? (
        <Spinner className="w-4 h-4" />
      ) : (
        <Archive className="w-4 h-4" />
      )}
    </Button>
  );
}
