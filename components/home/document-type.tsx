import { LucideProps } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import { Link } from "@/config/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DocumentTypeProps {
  href: string;
  translationKey: string;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export default async function DocumentType({
  href,
  translationKey,
  Icon,
}: DocumentTypeProps) {
  const t = await getTranslations(translationKey);
  return (
    <Card className="border-border group transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-sm-navy-gold hover:cursor-pointer">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="font-serif text-xl text-foreground">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("description")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={href}>
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 group-hover:cursor-pointer">
            {t("submit")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
