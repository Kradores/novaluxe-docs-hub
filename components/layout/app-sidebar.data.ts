import {
  Building2,
  FileType,
  FileUser,
  IdCard,
  LucideProps,
  Pickaxe,
  Users2,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import { allRoutes } from "@/config/site";

export type NavigationItemProps = {
  label: string;
  href: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

export type NavigationGrouoProps = {
  label: string;
  items: NavigationItemProps[];
};

export const getDocTypeRoutes = async (): Promise<NavigationItemProps[]> => {
  const t = await getTranslations("nav");
  return [
    {
      label: t("companyDocumentTypes"),
      href: allRoutes.companyDocumentTypes,
      icon: FileType,
    },
    {
      label: t("workerDocumentTypes"),
      href: allRoutes.workerDocumentTypes,
      icon: FileUser,
    },
  ];
};

export const getDocRoutes = async (): Promise<NavigationItemProps[]> => {
  const t = await getTranslations("nav");
  return [
    {
      label: t("companyDocuments"),
      href: allRoutes.companyDocuments,
      icon: Building2,
    },
    {
      label: t("worker"),
      href: allRoutes.worker,
      icon: IdCard,
    },
    {
      label: t("constructionSite"),
      href: allRoutes.constructionSite,
      icon: Pickaxe,
    },
  ];
};

export const getSettingsRoutes = async (): Promise<NavigationItemProps[]> => {
  const t = await getTranslations("nav");
  return [
    {
      label: t("users"),
      href: allRoutes.users,
      icon: Users2,
    },
  ];
};

export const getSidebarGroupsContent = async (): Promise<
  NavigationGrouoProps[]
> => {
  const [t, docTypes, docs, settings] = await Promise.all([
    getTranslations("nav"),
    getDocTypeRoutes(),
    getDocRoutes(),
    getSettingsRoutes(),
  ]);

  return [
    {
      label: t("documentTypes"),
      items: docTypes,
    },
    {
      label: t("documents"),
      items: docs,
    },
    {
      label: t("settings"),
      items: settings,
    },
  ];
};
