import JSZip from "jszip";
import { createClient } from "@supabase/supabase-js";

type GenerateCollectionZipRequest = {
  collectionId: string;
  mode?: "zip" | "preview";
};

type CompanyDocumentRow = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number; // some precision will be lost for huge files, that's acceptable
  document_type_name: string;
};

type WorkerDocumentRow = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number; // some precision will be lost for huge files, that's acceptable
  worker_name: string;
  document_type_name: string;
};

const sanitize = (value: string) =>
  value
    .trim()
    .replace(/[\/\\?%*:|"<>]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 100);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const body = (await req.json()) as GenerateCollectionZipRequest;

    if (!body.collectionId) {
      return new Response("Missing collectionId", { status: 400 });
    }

    const mode = body.mode ?? "zip";

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    /* -----------------------------
     * Load collection
     * ----------------------------- */
    const { data: collection, error: collectionError } = await supabase
      .from("document_collections")
      .select(
        `
        id,
        name,
        collection_company_documents(company_document_id),
        collection_worker_document_types(worker_document_type_id),
        collection_workers(worker_id)
      `,
      )
      .eq("id", body.collectionId)
      .single();

    if (collectionError || !collection) {
      return new Response("Collection not found", { status: 404 });
    }

    /* -----------------------------
     * Fetch company documents
     * ----------------------------- */
    const { data: companyDocuments, error: companyDocsError } =
      (await supabase.rpc("get_active_company_documents", {
        company_document_ids:
          collection.collection_company_documents.map<string>(
            (v) => v.company_document_id,
          ),
      })) as { data: CompanyDocumentRow[] | null; error: unknown };

    if (companyDocsError) {
      throw companyDocsError;
    }

    /* -----------------------------
     * Fetch worker documents
     * ----------------------------- */
    const { data: workerDocuments, error: workerDocsError } =
      (await supabase.rpc("get_active_worker_documents", {
        worker_ids: collection.collection_workers.map<string>(
          (v) => v.worker_id,
        ),
        worker_document_type_ids:
          collection.collection_worker_document_types.map<string>(
            (v) => v.worker_document_type_id,
          ),
      })) as { data: WorkerDocumentRow[] | null; error: unknown };

    if (workerDocsError) {
      throw workerDocsError;
    }

    const { data: uploadedDocuments, error: uploadedDocsError } = await supabase
      .from("collection_uploaded_documents")
      .select<
        string,
        { id: string; file_name: string; file_path: string }
      >("id, file_name, file_path")
      .eq("document_collection_id", collection.id);

    if (uploadedDocsError) {
      throw uploadedDocsError;
    }

    const companyDocs = companyDocuments ?? [];
    const workerDocs = workerDocuments ?? [];
    const uploadedDocs = uploadedDocuments ?? [];

    /* -----------------------------
     * Preview mode (share page)
     * ----------------------------- */
    if (mode === "preview") {
      const companyGrouped = Object.values(
        companyDocs.reduce<
          Record<string, { id: string; documentType: string; fileName: string }>
        >((acc, doc) => {
          acc[doc.document_type_name] ??= {
            id: doc.id,
            documentType: doc.document_type_name,
            fileName: doc.file_name,
          };
          return acc;
        }, {}),
      );

      const workerGrouped = Object.values(
        workerDocs.reduce<
          Record<
            string,
            {
              workerName: string;
              documents: Record<
                string,
                { id: string; documentType: string; fileName: string }
              >;
            }
          >
        >((acc, doc) => {
          acc[doc.worker_name] ??= {
            workerName: doc.worker_name,
            documents: {},
          };

          acc[doc.worker_name].documents[doc.document_type_name] ??= {
            id: doc.id,
            documentType: doc.document_type_name,
            fileName: doc.file_name,
          };

          return acc;
        }, {}),
      ).map((w) => ({
        workerName: w.workerName,
        documents: Object.values(w.documents),
      }));

      const uploadedGrouped = uploadedDocs;

      return Response.json({
        companyDocuments: companyGrouped,
        workerDocuments: workerGrouped,
        uploadedDocuments: uploadedGrouped,
      });
    }

    /* -----------------------------
     * ZIP generation
     * ----------------------------- */
    if (
      companyDocs.length === 0 &&
      workerDocs.length === 0 &&
      uploadedDocs.length === 0
    ) {
      return new Response("No valid documents to generate ZIP", {
        status: 400,
      });
    }

    const zip = new JSZip();
    const bucket = supabase.storage.from("documents");
    const upBucket = supabase.storage.from("collection-uploaded-documents");

    for (const doc of companyDocs) {
      const { data } = await bucket.download(doc.file_path);
      if (!data) continue;

      const buffer = new Uint8Array(await data.arrayBuffer());
      const path = `company-documents/${sanitize(doc.document_type_name)}/${doc.file_name}`;

      zip.file(path, buffer);
    }

    for (const doc of workerDocs) {
      const { data } = await bucket.download(doc.file_path);
      if (!data) continue;

      const buffer = new Uint8Array(await data.arrayBuffer());
      const path = `workers/${sanitize(doc.worker_name)}/${sanitize(doc.document_type_name)}/${doc.file_name}`;

      zip.file(path, buffer);
    }

    for (const doc of uploadedDocs) {
      const { data } = await upBucket.download(doc.file_path);
      if (!data) continue;

      const buffer = new Uint8Array(await data.arrayBuffer());
      const path = `uploaded-documents/${doc.file_name}`;

      zip.file(path, buffer);
    }

    const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    const zipPath = `collections/${collection.id}.zip`;

    const { error: uploadError } = await bucket.upload(zipPath, zipBuffer, {
      contentType: "application/zip",
      upsert: true,
    });

    if (uploadError) {
      throw uploadError;
    }

    await supabase
      .from("document_collections")
      .update({
        zip_status: "ready",
        zip_path: zipPath,
        zip_generated_at: new Date().toISOString(),
        zip_size: zipBuffer.byteLength,
      })
      .eq("id", collection.id);

    return new Response(JSON.stringify({ status: "ready" }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
});
