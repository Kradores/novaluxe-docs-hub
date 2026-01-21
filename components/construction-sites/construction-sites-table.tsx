import { Eye } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { allRoutes } from "@/config/site";
import { Link } from "@/config/i18n/navigation";
import { ConstructionSite } from "@/types/construction-site";

import { Button } from "../ui/button";

import DeleteConfirmButton from "./delete-confirm-button";

type ConstructionSiteTableProps = {
  items: ConstructionSite[];
};

export default async function ConstructionSitesTable({
  items,
}: ConstructionSiteTableProps) {
  const t = await getTranslations("constructionSite.table");

  if (!items.length) {
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
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2 font-medium">{item.name}</td>
              <td className="px-4 py-2 text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-center">
                <Link href={`${allRoutes.constructionSite}/${item.id}`}>
                  <Button size="icon" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
                <DeleteConfirmButton id={item.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
