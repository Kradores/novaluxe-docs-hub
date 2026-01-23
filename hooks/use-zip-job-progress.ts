"use client";

import { useEffect, useRef, useState } from "react";

import { createSupabaseBrowserClient } from "@/integrations/supabase/client";

export type ZipJob = {
  status: "pending" | "running" | "ready" | "failed";
  progress: number;
  last_error?: string | null;
};

export function useZipJobProgress(collectionId: string) {
  const supabase = createSupabaseBrowserClient();
  const [job, setJob] = useState<ZipJob | null>(null);
  const status = useRef<ZipJob["status"] | null>(null);

  useEffect(() => {
    supabase
      .from("zip_jobs")
      .select("status, progress, last_error")
      .eq("collection_id", collectionId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setJob(data);
      });

    const channel = supabase
      .channel(`zip-job-${collectionId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "zip_jobs",
          filter: `collection_id=eq.${collectionId}`,
        },
        (payload) => {
          setJob(payload.new as ZipJob);
          if (status.current === "ready" || status.current === "failed") {
            supabase.removeChannel(channel);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [collectionId, supabase]);

  return job;
}
