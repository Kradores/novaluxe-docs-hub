"use client";

import { useCallback, useRef } from "react";

import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { uploadFileTus } from "@/lib/upload-tus";
import { sanitize } from "@/lib/utils";
import { runWithConcurrency } from "@/lib/server/utils";
import {
  AttachmentsAction,
  FileWithProgress,
} from "@/components/site-collection/create-collection-dialog";

type UploadArgs = {
  collectionId: string;
  attachments: Map<string, FileWithProgress>;
  dispatch: React.Dispatch<AttachmentsAction>;
  concurrency?: number;
};

export const useConcurrentCollectionUpload = () => {
  const supabaseRef = useRef(createSupabaseBrowserClient());

  const uploadAll = useCallback(
    async ({
      collectionId,
      attachments,
      dispatch,
      concurrency = 3,
    }: UploadArgs) => {
      if (attachments.size === 0) return;

      const entries = Array.from(attachments.entries());

      await runWithConcurrency(entries, concurrency, async ([key, atc]) => {
        const filePath = `attachments/${collectionId}/${Date.now()}_${sanitize(
          atc.file.name,
        )}`;

        await uploadFileTus({
          supabase: supabaseRef.current,
          file: atc.file,
          bucket: "collection-uploaded-documents",
          objectPath: filePath,
          onProgress: (progress) => {
            dispatch({
              type: "SET_PROGRESS",
              payload: { key, progress },
            });
          },
        });

        const { error } = await supabaseRef.current
          .from("collection_uploaded_documents")
          .insert({
            file_name: atc.file.name,
            file_path: filePath,
            file_size: atc.file.size,
            file_type: atc.file.type || "application/octet-stream",
            document_collection_id: collectionId,
          });

        if (error) throw error;
      });
    },
    [],
  );

  return { uploadAll };
};
