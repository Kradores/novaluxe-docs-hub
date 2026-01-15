export const siteName = "Novaluxe Dynamics";

export type RouteType = keyof typeof allRoutes;
export const allRoutes = {
  login: "/login",
  home: "/",
  companyDocumentTypes: "/company-document-types",
  workerDocumentTypes: "/worker-document-types",
  companyDocuments: "/company-documents",
  worker: "/worker",
  constructionSite: "/construction-site",
  users: "/users",
  invite: "/invite",
  inviteInvalid: "/invite-invalid",
};
