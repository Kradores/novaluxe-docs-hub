import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { CollectionWorker } from "@/types/site-collection";

export default function useFetchWorkers(workerDocTypeIds: string[]) {
  const [workers, setWorkers] = useState<CollectionWorker[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchWorkers() {
      try {
        setIsLoading(true);
        const supabase = await createSupabaseBrowserClient();

        const { data, error } = await supabase
          .from("workers")
          .select(
            "id, full_name, worker_documents!inner(worker_document_type_id)",
          )
          .in("worker_documents.worker_document_type_id", workerDocTypeIds)
          .or("expiration_date.is.null,expiration_date.gte.now()", {
            referencedTable: "worker_documents",
          })
          .abortSignal(controller.signal);

        if (error) throw error.message;
        setWorkers(data);
        setIsLoading(false);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        if (error === "string") {
          toast.error(error);
        }
      }
    }

    fetchWorkers();

    return () => controller.abort();
  }, [workerDocTypeIds]);

  return { workers, isLoading };
}
