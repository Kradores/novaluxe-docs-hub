"use client";

import { useZipJobProgress } from "@/hooks/use-zip-job-progress";

export function ZipProgress({ collectionId }: { collectionId: string }) {
  const job = useZipJobProgress(collectionId);

  if (!job) return null;

  if (job.status === "failed") {
    return (
      <div className="text-red-600">
        ZIP failed: {job.last_error ?? "Unknown error"}
      </div>
    );
  }

  if (job.status === "ready") {
    return <div className="text-green-600">ZIP is ready ✅</div>;
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-muted-foreground">Generating ZIP…</div>

      <div className="w-full h-3 bg-muted rounded">
        <div
          className="h-3 bg-primary rounded transition-all"
          style={{ width: `${job.progress}%` }}
        />
      </div>

      <div className="text-xs text-muted-foreground">{job.progress}%</div>
    </div>
  );
}
