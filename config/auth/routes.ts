import { allRoutes } from "../site";

export const PUBLIC_ROUTES = [
  allRoutes.login,
  allRoutes.share,
  allRoutes.assignRole,
  allRoutes.bye,
];

export const AUTH_ROUTES = [allRoutes.login];

export const PROTECTED_ROUTE_PREFIXES = [];
