import { Badge } from "@/components/ui/badge";
import { Worker } from "@/types/worker";

import WorkerCard from "./worker-card";

interface WorkersSectionProps {
  title: string;
  noWorkersText: string;
  workers: Worker[];
  badgeVariant: "success" | "warning";
}

export default function WorkersSection({
  title,
  noWorkersText,
  workers,
  badgeVariant,
}: WorkersSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Badge variant={badgeVariant}>{workers.length}</Badge>
      </div>

      {workers.length === 0 ? (
        <p className="text-muted-foreground text-sm py-6 text-center bg-secondary/40 rounded-lg">
          {noWorkersText}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}
    </section>
  );
}
