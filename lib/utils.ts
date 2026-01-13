import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  return segments.length > 2 ? `/${segments.slice(2).join("/")}` : "/";
}

export const getInitials = (fullName: string) => {
  // 1. Remove common lower-case particles like "de", "del", "y"
  // that shouldn't contribute to initials
  const cleanedParts = fullName
    .split(" ")
    .filter(
      (part) => !["de", "del", "y", "e", ""].includes(part.toLowerCase()),
    );

  if (cleanedParts.length === 0) return undefined;
  if (cleanedParts.length === 1) return cleanedParts[0][0].toUpperCase();

  // 2. In Spain, the first surname is the most important (usually the 2nd part).
  // For "José Luis Rodríguez Zapatero", initials are usually "JR" (First Name + First Surname)
  // We take the first part and the second significant part.
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
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} GB`;
}
