"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import DocumentStatusBadge from "@/components/document-status-badge";

import DeleteConfirmButton from "./delete-confirm-button";

type CompanyDocumentsTableProps = {
  documents: DocumentTypeProps[];
};

type DocumentTypeProps = {
  id: string;
  name: string;
  created_at: string;
  company_document_types: { id: string; name: string };
  file_name: string;
  expiration_date: string;
  file_type: string;
  file_path: string;
};

export default function CompanyDocumentsTable({
  documents,
}: CompanyDocumentsTableProps) {
  const t = useTranslations("companyDocuments.table");
  const handleDownload = async (doc: DocumentTypeProps) => {
    const res = await fetch(`/api/documents/download?path=${doc.file_path}`);
    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.file_name;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!documents.length) {
    return <p className="text-sm text-muted-foreground">{t("noResults")}</p>;
  }

  return (
    <div className="rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">{t("headers.0")}</th>
            <th className="px-4 py-2 text-left">{t("headers.1")}</th>
            <th className="px-4 py-2 text-left">{t("headers.2")}</th>
            <th className="px-4 py-2 text-left">{t("headers.3")}</th>
            <th className="px-4 py-2 text-left">{t("headers.4")}</th>
            <th className="px-4 py-2">{t("headers.5")}</th>
          </tr>
        </thead>

        <tbody>
          {documents.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2 font-medium">
                {item.company_document_types.name}
              </td>
              <td className="px-4 py-2 font-medium">{item.file_name}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(item.created_at).toDateString()}
              </td>
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(item.expiration_date).toDateString()}
              </td>
              <td className="px-4 py-2 text-muted-foreground">
                <DocumentStatusBadge expirationDate={item.expiration_date} />
              </td>
              <td className="px-4 py-2 text-center">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDownload(item)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <DeleteConfirmButton filePath={item.file_path} id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
