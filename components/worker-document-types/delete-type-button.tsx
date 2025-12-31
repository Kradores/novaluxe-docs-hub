"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { deleteDocumentType } from "@/app/[locale]/worker-document-types/actions";
import ConfirmDialog from "@/components/confirm-dialog";

type Props = {
  id: string;
};

export default function DeleteTypeButton({ id }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("workerDocumentTypes.delete");

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteDocumentType(id);
        toast.success(t("success"));
      } catch (error: unknown) {
        if (error instanceof Error && error.message === "IN_USE") {
          toast.error(t("errorInUse"));
        } else {
          toast.error(t("error"));
        }
      }
    });
  };

  return (
    <ConfirmDialog
      description="This action cannot be undone."
      title="Delete document"
      onConfirm={handleDelete}
    >
      <Button
        className="text-destructive hover:bg-destructive/20"
        disabled={isPending}
        size="sm"
        variant="ghost"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </ConfirmDialog>
  );
}
