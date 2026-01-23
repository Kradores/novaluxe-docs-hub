"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/confirm-dialog";
import { deleteWorkerDocument } from "@/app/[locale]/worker/[id]/actions";
import { useRole } from "@/components/role-provider";

type Props = {
  id: string;
  filePath: string;
};

export default function DeleteConfirmButton({ id, filePath }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("workerDocuments.delete");
  const { isUser } = useRole();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteWorkerDocument(id, filePath);
        toast.success(t("success"));
      } catch {
        toast.error(t("error"));
      }
    });
  };

  return (
    <ConfirmDialog
      description={t("description")}
      title={t("title")}
      onConfirm={handleDelete}
    >
      {!isUser && (
        <Button
          className="text-destructive hover:bg-destructive/20"
          disabled={isPending}
          size="sm"
          variant="ghost"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
    </ConfirmDialog>
  );
}
