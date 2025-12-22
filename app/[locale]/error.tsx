"use client";

import { startTransition, useEffect } from "react";
import { toast } from "sonner";

import { useRouter } from "@/config/i18n/navigation";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const reload = () => {
    startTransition(() => {
      router.refresh();
      reset();
    });
  };

  useEffect(() => {
    toast.error(error.message);
  }, [error]);

  return (
    <div>
      <h2>{error.message}</h2>
      <button onClick={() => reload()}>Try again</button>
    </div>
  );
}
