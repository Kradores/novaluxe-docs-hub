"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/confirm-dialog";
import { deleteCompanyDocument } from "@/app/[locale]/company-documents/actions";

type Props = {
  id: string;
  filePath: string;
};

export default function DeleteConfirmButton({ id, filePath }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("companyDocuments.delete");

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCompanyDocument(id, filePath);
        toast.success(t("success"));
      } catch (error: unknown) {
        toast.error(t("error"));
        console.error(error);
      }
    });
  };

  return (
    <ConfirmDialog
      description={t("description")}
      title={t("title")}
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
