"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { WorkerStatus } from "@/types/worker";

export default function WorkerStatusBadge({
  status,
}: {
  status: WorkerStatus;
}) {
  const t = useTranslations("common");
  return (
    <Badge
      variant={
        status === "laidOff"
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
