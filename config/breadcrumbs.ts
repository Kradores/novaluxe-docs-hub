import { getWorkerById } from "@/app/[locale]/worker/[id]/actions";
import { getConstructionSiteById } from "@/app/[locale]/construction-site/[id]/actions";

import { allRoutes, RouteType } from "./site";

export type BreadcrumbResolver = {
  staticLabel: string;
  href: string;
  dynamic?: {
    getLabel: (id: string) => Promise<string>;
    getHref: (id: string) => string;
  };
};

export const breadcrumbConfig: Record<RouteType, BreadcrumbResolver> = {
  login: {
    staticLabel: "login",
    href: allRoutes.login,
  },

  home: {
    staticLabel: "home",
    href: allRoutes.home,
  },

  companyDocumentTypes: {
    staticLabel: "companyDocumentTypes",
    href: allRoutes.companyDocumentTypes,
  },

  workerDocumentTypes: {
    staticLabel: "workerDocumentTypes",
    href: allRoutes.workerDocumentTypes,
  },

  companyDocuments: {
    staticLabel: "companyDocuments",
    href: allRoutes.companyDocuments,
  },

  worker: {
    staticLabel: "worker",
    href: allRoutes.worker,
    dynamic: {
      getLabel: async (id) => {
        const worker = await getWorkerById(id);
        return worker.full_name;
      },
      getHref: (id) => [allRoutes.worker, id].filter(Boolean).join("/"),
    },
  },

  constructionSite: {
    staticLabel: "constructionSite",
    href: allRoutes.constructionSite,
    dynamic: {
      getLabel: async (id) => {
        const site = await getConstructionSiteById(id);
        return site.name;
      },
      getHref: (id) =>
        [allRoutes.constructionSite, id].filter(Boolean).join("/"),
    },
  },

  users: {
    staticLabel: "users",
    href: allRoutes.users,
  },
};
