import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

import { Locale, locales } from "@/config/locales";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  if (segments.length > 1) {
    return segments
      .filter((segment) => !locales.includes(segment as Locale))
      .join("/");
  }

  return "/";
}

// export function stripLocale(pathname: string) {
//   const segments = pathname.split("/");
//   return segments.length > 2 ? `/${segments.slice(2).join("/")}` : "/";
// }

export const getInitials = (fullName: string) => {
  // Remove common lower-case particles like "de", "del", "y"
  const cleanedParts = fullName
    .split(" ")
    .filter(
      (part) => !["de", "del", "y", "e", ""].includes(part.toLowerCase()),
    );

  if (cleanedParts.length === 0) return undefined;
  if (cleanedParts.length === 1) return cleanedParts[0][0].toUpperCase();

  const firstInitial = cleanedParts[0][0];
  const firstSurnameInitial = cleanedParts[1][0];

  return (firstInitial + firstSurnameInitial).toUpperCase();
};

export function assertDefined<T>(
  value: T | undefined,
  name = "Value",
): asserts value is T {
  if (value === undefined) {
    throw new Error(
      `${name} is undefined, check the steps prior to using this variable`,
    );
  }
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} GB`;
}

export function handleErrorToast(error: unknown): void {
  if (error instanceof Error && error.name === "AbortError") {
    return;
  }

  let message = "An unexpected error occurred.";

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String((error as { message: unknown }).message);
  }

  toast.error(message);

  // eslint-disable-next-line no-console
  console.error("[Error Handler]:", error);
}

/**
 * Replaces dynamic path segments (e.g., [token]) with values from an arguments object.
 * Throws an error if any segments remain unreplaced.
 */
export function interpolateRoute(
  route: string,
  args?: Record<string, string>,
): string {
  let result = route;

  if (args) {
    Object.entries(args).forEach(([key, value]) => {
      const placeholder = `[${key}]`;
      result = result.split(placeholder).join(value);
    });
  }

  validateRote(result);

  return result;
}

export function validateRote(route: string) {
  if (/\[.*?\]/.test(route)) {
    const missingKeys = route.match(/\[.*?\]/g);
    throw new Error(
      `Missing values for route segments: ${missingKeys?.join(", ")}`,
    );
  }
}

export function sanitize(value: string) {
  return value
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export const toggle = (arr: string[], id: string) =>
  arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id];
