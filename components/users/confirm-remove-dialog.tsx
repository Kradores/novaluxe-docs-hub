"use client";

import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { ActiveUser } from "@/types/user";
import { Button } from "@/components/ui/button";
import { removeUser } from "@/app/[locale]/users/actions";
import { handleErrorToast } from "@/lib/utils";
import ConfirmDialog from "@/components/confirm-dialog";

type Props = {
  user: ActiveUser;
};

export const ConfirmRemoveDialog = ({ user }: Props) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("users.delete");

  const handleRemoveUser = () => {
    startTransition(async () => {
      try {
        await removeUser(user.user_id);
        toast.success(t("success"));
      } catch (error) {
        handleErrorToast(error);
      }
    });
  };
  return (
    <ConfirmDialog
      description={t("description", { username: user.email })}
      title={t("title")}
      onConfirm={handleRemoveUser}
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
};
