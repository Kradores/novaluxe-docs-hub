"use client";

import { useTransition, useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { CollectionZipStatus } from "@/types/site-collection";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { getZipStatus } from "@/app/(public)/[locale]/share/[token]/actions";

export function CheckAndDownloadButton({ token }: { token: string }) {
  const t = useTranslations("constructionSiteDetail");
  const [status, setStatus] = useState<CollectionZipStatus>("idle");
  const [isPending, startTransition] = useTransition();

  const handleCheck = () => {
    startTransition(async () => {
      const result = await getZipStatus(token);
      setStatus(result);
    });
  };

  return (
    <div className="flex gap-4">
      <div className="flex justify-between w-full gap-4">
        <Badge
          variant={
            status === "failed"
              ? "destructive"
              : status === "ready"
                ? "success"
                : "secondary"
          }
        >
          {t("status", { status })}
        </Badge>
        <Button
          className="w-37"
          disabled={isPending}
          variant="secondary"
          onClick={handleCheck}
        >
          {isPending ? <Spinner className="w-4 h-4" /> : t("checkZip")}
        </Button>
      </div>
      {status === "ready" && (
        <Button
          onClick={() =>
            (window.location.href = `/share/${token}/download-all`)
          }
        >
          {t("downloadZip")}
        </Button>
      )}
    </div>
  );
}
