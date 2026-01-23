"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { DialogTrigger } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createDocumentType } from "@/app/[locale]/worker-document-types/actions";
import { useRole } from "@/components/role-provider";

export default function CreateTypeDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("workerDocumentTypes.create");
  const { isUser } = useRole();

  const handleCreate = () => {
    startTransition(async () => {
      try {
        await createDocumentType(name);
        toast.success(t("success"));
        setName("");
        setOpen(false);
      } catch {
        toast.error(t("error"));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {!isUser && (
          <Button className="gap-2" onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4" />
            {t("openDialogLabel")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder={t("placeholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
        />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button disabled={!name.trim() || isPending} onClick={handleCreate}>
            {t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
