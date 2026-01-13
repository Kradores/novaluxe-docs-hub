"use client";

import { useTransition, useState } from "react";

import { Button } from "@/components/ui/button";
import { CollectionZipStatus } from "@/types/site-collection";
import { getZipStatus } from "@/app/[locale]/share/[token]/actions";

import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";

export function CheckAndDownloadButton({ token }: { token: string }) {
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
      <div className="flex justify-between w-full">
        <Badge
          variant={
            status === "failed"
              ? "destructive"
              : status === "ready"
                ? "success"
                : "secondary"
          }
        >
          Status: {status}
        </Badge>
        <Button
          className="w-37"
          disabled={isPending}
          variant="secondary"
          onClick={handleCheck}
        >
          {isPending ? <Spinner className="w-4 h-4" /> : "Check ZIP status"}
        </Button>
      </div>
      {status === "ready" && (
        <Button
          onClick={() =>
            (window.location.href = `/share/${token}/download-all`)
          }
        >
          Download ZIP
        </Button>
      )}
    </div>
  );
}
