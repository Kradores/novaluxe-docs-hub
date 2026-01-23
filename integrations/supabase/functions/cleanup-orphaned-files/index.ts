import { createClient, SupabaseClient } from "@supabase/supabase-js";

type TableRef = {
  table: string;
  column: string;
};

type GenericColumn = { [key: string]: string };

const BUCKETS: Record<string, TableRef[]> = {
  documents: [
    { table: "document_collections", column: "zip_path" },
    { table: "worker_documents", column: "file_path" },
    { table: "company_documents", column: "file_path" },
  ],
  "collection-uploaded-documents": [
    { table: "collection_uploaded_documents", column: "file_path" },
  ],
  "worker-photos": [{ table: "workers", column: "photo_path" }],
};

const DRY_RUN = Deno.env.get("DRY_RUN") === "true";
const MAX_DELETIONS = Number(Deno.env.get("MAX_DELETIONS_PER_BUCKET")) || 500;
const MIN_FILE_AGE_HOURS = Number(Deno.env.get("MIN_FILE_AGE_HOURS")) || 24;

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const now = Date.now();
  const minAgeMs = MIN_FILE_AGE_HOURS * 60 * 60 * 1000;

  const summary: Record<
    string,
    { scanned: number; orphaned: number; deleted: number }
  > = {};

  for (const bucket of Object.keys(BUCKETS)) {
    // 1️⃣ Collect all referenced paths for this bucket
    const referencedPaths = new Set<string>();

    for (const { table, column } of BUCKETS[bucket]) {
      const { data, error } = await supabase
        .from(table)
        .select<string, GenericColumn>(column)
        .not(column, "is", null);

      if (error) {
        continue;
      }

      data?.forEach((row: GenericColumn) => referencedPaths.add(row[column]));
    }

    // 2️⃣ List all files in bucket (recursive)
    const files = await listAllFiles(supabase, bucket);

    // 3️⃣ Find orphaned files (not referenced AND old enough)
    const orphaned = files
      .filter((f) => !referencedPaths.has(f.path))
      .filter((f) => now - f.updatedAt >= minAgeMs)
      .slice(0, MAX_DELETIONS);

    // 4️⃣ Delete (or dry-run)
    if (!DRY_RUN && orphaned.length > 0) {
      await supabase.storage.from(bucket).remove(orphaned.map((f) => f.path));
    }

    const deletedCount = DRY_RUN ? 0 : orphaned.length;

    summary[bucket] = {
      scanned: files.length,
      orphaned: orphaned.length,
      deleted: deletedCount,
    };

    await logCleanup(supabase, {
      bucket,
      scanned: files.length,
      orphaned: orphaned.length,
      deleted: deletedCount,
      dryRun: DRY_RUN,
      minAge: MIN_FILE_AGE_HOURS,
      maxDeletions: MAX_DELETIONS,
    });
  }

  return new Response(
    JSON.stringify(
      {
        status: "ok",
        dryRun: DRY_RUN,
        minFileAgeHours: MIN_FILE_AGE_HOURS,
        maxDeletionsPerBucket: MAX_DELETIONS,
        summary,
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/json" } },
  );
});

//
// 🔁 Recursive file listing (SDK-safe)
//
type StorageFile = {
  path: string;
  updatedAt: number;
};

const listAllFiles = async (
  supabase: SupabaseClient,
  bucket: string,
  prefix = "",
): Promise<StorageFile[]> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(prefix, { limit: 1000 });

  if (error || !data) {
    return [];
  }

  const results: StorageFile[] = [];

  for (const item of data) {
    const fullPath = prefix ? `${prefix}/${item.name}` : item.name;

    if (item.id === null) {
      // 📁 folder
      const nested = await listAllFiles(supabase, bucket, fullPath);
      results.push(...nested);
    } else {
      // 📄 file
      results.push({
        path: fullPath,
        updatedAt: new Date(item.updated_at).getTime(),
      });
    }
  }

  return results;
};

const logCleanup = async (
  supabase: SupabaseClient,
  data: {
    bucket: string;
    scanned: number;
    orphaned: number;
    deleted: number;
    dryRun: boolean;
    minAge: number;
    maxDeletions: number;
  },
) => {
  await supabase.from("cleanup_logs").insert({
    function_name: "cleanup-orphaned-files",
    bucket: data.bucket,
    scanned_count: data.scanned,
    orphaned_count: data.orphaned,
    deleted_count: data.deleted,
    dry_run: data.dryRun,
    min_file_age_hours: data.minAge,
    max_deletions: data.maxDeletions,
  });
};
