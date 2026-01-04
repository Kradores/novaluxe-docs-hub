import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/config/i18n/navigation";

interface PageHeaderProps {
  backTo?: string;
  action?: ReactNode;
  title: string;
  subtitle?: string | false;
}

export default async function PageHeader({
  backTo,
  action,
  title,
  subtitle,
}: PageHeaderProps) {
  const t = await getTranslations("common");

  return (
    <div className="mb-8 animate-fade-in">
      {backTo && (
        <Link className="inline-block mb-4" href={backTo}>
          <Button
            className="gap-2 text-muted-foreground hover:text-foreground"
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gradient-gold">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-muted-foreground text-start">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
