import { getTranslations } from "next-intl/server";

import DeleteTypeButton from "./delete-type-button";

export type DocumentType = {
  id: string;
  name: string;
  created_at: string;
};

type Props = {
  data: DocumentType[];
};

export default async function DocumentTypesTable({ data }: Props) {
  const t = await getTranslations("workerDocumentTypes.table");
  if (!data.length) {
    return <p className="text-sm text-muted-foreground">{t("noResults")}</p>;
  }

  return (
    <div className="rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left">{t("headers.0")}</th>
            <th className="px-4 py-2 text-left">{t("headers.1")}</th>
            <th className="px-4 py-2">{t("headers.2")}</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2 font-medium">{item.name}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-center">
                <DeleteTypeButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
