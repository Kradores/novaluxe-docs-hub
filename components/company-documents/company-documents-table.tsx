import { useTranslations } from "next-intl";

import DocumentStatusBadge from "@/components/document-status-badge";

import DeleteConfirmButton from "./delete-confirm-button";
import DownloadButton from "./download-button";

type DocumentProps = {
  id: string;
  name: string;
  created_at: string;
  company_document_types: { id: string; name: string };
  file_name: string;
  expiration_date: string;
  file_type: string;
  file_path: string;
};

type CompanyDocumentsTableProps = {
  documents: DocumentProps[];
};

export default function CompanyDocumentsTable({
  documents,
}: CompanyDocumentsTableProps) {
  const t = useTranslations("companyDocuments.table");

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
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-muted-foreground">
                {item.expiration_date
                  ? new Date(item.expiration_date).toLocaleDateString()
                  : "-"}
              </td>
              <td className="px-4 py-2 text-muted-foreground">
                <DocumentStatusBadge expirationDate={item.expiration_date} />
              </td>
              <td className="px-4 py-2 text-center">
                <DownloadButton filePath={item.file_path} />
                <DeleteConfirmButton filePath={item.file_path} id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
