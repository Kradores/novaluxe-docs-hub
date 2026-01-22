"use client";

import * as tus from "tus-js-client";
import { SupabaseClient } from "@supabase/supabase-js";

type UploadTusParams = {
  supabase: SupabaseClient;
  file: File;
  bucket: string;
  objectPath: string;
  onProgress?: (progress: number) => void;
};

export const uploadFileTus = async ({
  supabase,
  file,
  bucket,
  objectPath,
  onProgress,
}: UploadTusParams): Promise<void> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("User is not authenticated");
  }

  return new Promise((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/upload/resumable`,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        "x-upsert": "true",
      },
      metadata: {
        bucketName: bucket,
        objectName: objectPath,
        contentType: file.type,
        cacheControl: "3600",
      },
      chunkSize: 8 * 1024 * 1024, // 8 MB (safe for Kong + browser)
      retryDelays: [0, 3000, 5000, 10000],
      onProgress(bytesUploaded, bytesTotal) {
        if (!onProgress) return;
        const pct = Math.round((bytesUploaded / bytesTotal) * 100);
        onProgress(pct);
      },
      onError(error) {
        reject(error);
      },
      onSuccess() {
        resolve();
      },
    });

    upload.start();
  });
};
