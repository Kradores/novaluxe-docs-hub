"use client";

import { useTranslations } from "next-intl";

import { getDocumentStatus } from "@/lib/document-status";
import { Badge } from "@/components/ui/badge";

export default function DocumentStatusBadge({
  expirationDate,
}: {
  expirationDate: string | null;
}) {
  const status = getDocumentStatus(expirationDate);
  const t = useTranslations("common");
  return (
    <Badge
      variant={
        status === "expired"
          ? "destructive"
          : status === "active"
            ? "success"
            : "secondary"
      }
    >
      {t(status)}
    </Badge>
  );
}
