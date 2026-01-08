"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Archive } from "lucide-react";

import { Button } from "@/components/ui/button";
import { triggerGenerateCollectionZip } from "@/app/[locale]/construction-site/[id]/actions";

import { Spinner } from "../ui/spinner";

type Props = {
  collectionId: string;
  zipStatus: "idle" | "processing" | "ready" | "failed";
};

export function GenerateZipButton({ collectionId, zipStatus }: Props) {
  const [isPending, startTransition] = useTransition();

  const disabled = zipStatus === "processing" || isPending;

  const handleGenerate = () => {
    startTransition(async () => {
      try {
        await triggerGenerateCollectionZip(collectionId);
        toast.success("ZIP generation started");
      } catch {
        toast.error("Failed to start ZIP generation");
      }
    });
  };

  if (zipStatus === "ready") {
    return <></>;
  }

  return (
    <Button
      disabled={disabled}
      size="sm"
      title={disabled ? "Generating..." : "Generate ZIP"}
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
