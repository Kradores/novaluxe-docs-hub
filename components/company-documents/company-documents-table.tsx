import { getTranslations } from "next-intl/server";

import DocumentStatusBadge from "@/components/document-status-badge";
import { CompanyDocumentModel } from "@/types/company-documents";
import { isRoleUser } from "@/lib/server/user";

import DeleteConfirmButton from "./delete-confirm-button";
import DownloadButton from "./download-button";

type CompanyDocumentsTableProps = {
  documents: CompanyDocumentModel[];
};

export default async function CompanyDocumentsTable({
  documents,
}: CompanyDocumentsTableProps) {
  const t = await getTranslations("companyDocuments.table");
  const isUser = await isRoleUser();

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
              <td className="px-4 py-2 font-medium overflow-hidden text-ellipsis text-nowrap max-w-0 w-full">
                {item.file_name}
              </td>
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(item.created_at).toDateString()}
              </td>
              <td className="px-4 py-2 text-muted-foreground">
                {item.expiration_date
                  ? new Date(item.expiration_date).toDateString()
                  : "-"}
              </td>
              <td className="px-4 py-2 text-muted-foreground text-nowrap">
                <DocumentStatusBadge expirationDate={item.expiration_date} />
              </td>
              <td className="px-4 py-2 text-center text-nowrap">
                <DownloadButton filePath={item.file_path} />
                {!isUser && (
                  <DeleteConfirmButton filePath={item.file_path} id={item.id} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
