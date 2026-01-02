export type DocumentStatus = "active" | "expired" | "noExpiration";

export const getDocumentStatus = (
  expirationDate: string | null,
): DocumentStatus => {
  if (!expirationDate) return "noExpiration";

  return new Date(expirationDate) >= new Date() ? "active" : "expired";
};
