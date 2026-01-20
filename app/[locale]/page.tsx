import { FileType, FileUser } from "lucide-react";
import { getTranslations } from "next-intl/server";

import DocumentType from "@/components/home/document-type";
import PageHeader from "@/components/page-header";
import { allRoutes } from "@/config/site";
import { forceSignOut, userHasRole } from "@/lib/server/user";
import { redirect } from "@/config/i18n/navigation";

type Props = {
  params: { locale: string };
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("documentTypes");
  const hasRole = await userHasRole();

  if (!hasRole) {
    await forceSignOut();
    redirect({ href: allRoutes.bye, locale });
  }

  return (
    <section className="flex flex-col items-center justify-center pt-10 pb-25 overflow-hidden">
      <div className="flex flex-col w-full max-w-8xl text-center justify-center px-4 md:px-4.5 lg:px-10 xl:px-20 2xl:px-31">
        <div className="space-y-16" />
        <PageHeader
          subtitle={t.has("subtitle") && t("subtitle")}
          title={t("title")}
        />
        <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
          <DocumentType
            Icon={FileType}
            href={allRoutes.companyDocumentTypes}
            translationKey="documentTypes.company"
          />
          <DocumentType
            Icon={FileUser}
            href={allRoutes.workerDocumentTypes}
            translationKey="documentTypes.workers"
          />
        </div>
      </div>
    </section>
  );
}
