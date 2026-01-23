export const siteName = "Novaluxe Dynamics";

export type RouteType = keyof typeof allRoutes;
export type BreadcrumbRouteType = Exclude<
  RouteType,
  "share" | "assignRole" | "bye"
>;
export const allRoutes = {
  login: "/login",
  home: "/",
  companyDocumentTypes: "/company-document-types",
  companyDocuments: "/company-documents",
  workerDocumentTypes: "/worker-document-types",
  worker: "/worker",
  constructionSite: "/construction-site",
  users: "/users",
  share: "/share",
  assignRole: "/assign-role",
  bye: "/bye",
};
