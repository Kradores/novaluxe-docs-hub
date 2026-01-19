import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripLocale(pathname: string) {
  const segments = pathname.split("/");
  return segments.length > 2 ? `/${segments.slice(2).join("/")}` : "/";
}

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
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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

  console.error("[Error Handler]:", error);
}
