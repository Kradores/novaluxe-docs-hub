"use client";

import { useCallback } from "react";

import { createSupabaseBrowserClient } from "@/integrations/supabase/client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "../ui/shadcn-io/dropzone";

export type UploadedFile = {
  id: string;
  file_name: string;
};

type Props = {
  documentCollectionId: string;
  uploadedFiles: UploadedFile[];
  onUploadComplete: (files: UploadedFile[]) => void;
};

export const CollectionUploadDropzone = ({
  documentCollectionId,
  uploadedFiles,
  onUploadComplete,
}: Props) => {
  const supabase = createSupabaseBrowserClient();

  const handleUpload = useCallback(
    async (files: File[]) => {
      const uploaded: UploadedFile[] = [];

      for (const file of files) {
        const path = `temp/${crypto.randomUUID()}-${file.name}`;

        await supabase.storage
          .from("collection-uploaded-documents")
          .upload(path, file);

        const { data } = await supabase
          .from("collection_uploaded_documents")
          .insert({
            file_name: file.name,
            file_path: path,
            file_size: file.size,
            file_type: file.type,
            document_collection_id: documentCollectionId,
          })
          .select()
          .single();

        uploaded.push(data);
      }

      onUploadComplete([...uploadedFiles, ...uploaded]);
    },
    [documentCollectionId, uploadedFiles, onUploadComplete, supabase],
  );

  return (
    <Dropzone onDrop={handleUpload}>
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};
