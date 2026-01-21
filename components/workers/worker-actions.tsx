"use client";

import { Eye, UserCheck, UserX } from "lucide-react";
import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Worker } from "@/types/worker";
import { updateWorkerStatus } from "@/app/[locale]/worker/actions";
import Link from "@/components/link";
import { allRoutes } from "@/config/site";

import { useRole } from "../role-provider";

import DeleteConfirmButton from "./delete-confirm-button";

export default function WorkerActions({ worker }: { worker: Worker }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("workers.actions");
  const { isUser } = useRole();

  const handleStatusToggle = () => {
    startTransition(async () => {
      try {
        await updateWorkerStatus(
          worker.id,
          worker.status === "active" ? "laidOff" : "active",
        );
        toast.success(t("update.success"));
      } catch {
        toast.error(t("update.error"));
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`${allRoutes.worker}/${worker.id}`}>
        <Button size="icon" variant="ghost">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>

      {!isUser && (
        <>
          <Button
            className="hover:bg-foreground/10"
            disabled={isPending}
            size="icon"
            variant="ghost"
            onClick={handleStatusToggle}
          >
            {worker.status === "active" ? (
              <UserX className="h-4 w-4 text-amber-500" />
            ) : (
              <UserCheck className="h-4 w-4 text-emerald-500" />
            )}
          </Button>

          <DeleteConfirmButton filePath={worker.photo_path} id={worker.id} />
        </>
      )}
    </div>
  );
}
