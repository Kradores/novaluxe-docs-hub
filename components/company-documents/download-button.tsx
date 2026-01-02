"use client";

import { Download } from "lucide-react";

import { Button } from "../ui/button";

export type DocumentProps = {
  id: string;
  name: string;
  created_at: string;
  company_document_types: { id: string; name: string };
  file_name: string;
  expiration_date: string;
  file_type: string;
  file_path: string;
};

type DownloadButtonProps = {
  item: DocumentProps;
};

export default function DownloadButton({ item }: DownloadButtonProps) {
  const handleDownload = async (doc: DocumentProps) => {
    const res = await fetch(`/api/documents/download?path=${doc.file_path}`);
    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.file_name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button size="icon" variant="ghost" onClick={() => handleDownload(item)}>
      <Download className="h-4 w-4" />
    </Button>
  );
}
