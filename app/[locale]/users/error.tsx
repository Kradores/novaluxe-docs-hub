"use client";

import { startTransition, useEffect } from "react";
import { toast } from "sonner";

import { useRouter } from "@/config/i18n/navigation";
import { Button } from "@/components/ui/button";

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
    toast.error(error.message, { position: "top-right" });
  }, [error]);

  return (
    <div className="space-y-4">
      <h2>{error.message}</h2>
      <Button variant={"outline"} onClick={() => reload()}>
        Try again
      </Button>
    </div>
  );
}
