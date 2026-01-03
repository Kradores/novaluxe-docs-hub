import { getTranslations } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import { Worker } from "@/types/worker";

import WorkerActions from "./worker-actions";
import WorkerAvatar from "./worker-avatar";

export default async function WorkerCard({ worker }: { worker: Worker }) {
  const t = await getTranslations("workers");
  return (
    <Card className="hover:shadow-sm transition">
      <CardContent className="p-4 flex gap-4 items-center">
        <WorkerAvatar worker={worker} />

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{worker.full_name}</p>
          <p className="text-sm text-muted-foreground">
            {t("counter", { count: worker.document_count })}
          </p>
        </div>

        <WorkerActions worker={worker} />
      </CardContent>
    </Card>
  );
}
