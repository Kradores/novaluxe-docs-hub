"use client";

import { Download } from "lucide-react";

import { getSignedDocumentUrl } from "@/app/[locale]/company-documents/actions";
import { Button } from "@/components/ui/button";

type DownloadButtonProps = {
  filePath: string;
};

export default function DownloadButton({ filePath }: DownloadButtonProps) {
  const handleOpen = async (filePath: string) => {
    const url = await getSignedDocumentUrl(filePath);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Button size="icon" variant="ghost" onClick={() => handleOpen(filePath)}>
      <Download className="h-4 w-4" />
    </Button>
  );
}
