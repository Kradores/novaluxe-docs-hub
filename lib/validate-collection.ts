import { SupabaseClient } from "@supabase/supabase-js";

type ValidateCollectionInput = {
  companyDocumentIds: string[];
  workerDocumentTypeIds: string[];
  workerIds: string[];
};

type ValidationResult = { valid: true } | { valid: false; message: string };

export const validateCollection = async (
  supabase: SupabaseClient,
  input: ValidateCollectionInput,
): Promise<ValidationResult> => {
  const { companyDocumentIds, workerDocumentTypeIds, workerIds } = input;

  /* -----------------------------
   * Validate company documents
   * ----------------------------- */
  if (companyDocumentIds.length > 0) {
    const { count, error } = await supabase
      .from("company_documents")
      .select("id", { count: "exact", head: true })
      .in("id", companyDocumentIds)
      .or("expiration_date.is.null,expiration_date.gte.now()");

    if (error) throw error;

    if (!count || count === 0) {
      return {
        valid: false,
        message:
          "No valid company documents found for selected document types.",
      };
    }
  }

  /* -----------------------------
   * Validate workers individually
   * ----------------------------- */
  for (const workerId of workerIds) {
    const { count, error } = await supabase
      .from("worker_documents")
      .select("id", { count: "exact", head: true })
      .eq("worker_id", workerId)
      .in("worker_document_type_id", workerDocumentTypeIds)
      .or("expiration_date.is.null,expiration_date.gte.now()");

    if (error) throw error;

    if (!count || count === 0) {
      return {
        valid: false,
        message: `Worker ${workerId} has no valid documents for the selected document types.`,
      };
    }
  }

  return { valid: true };
};
