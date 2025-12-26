import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  return segments.length > 2 ? `/${segments.slice(2).join("/")}` : "/";
}
