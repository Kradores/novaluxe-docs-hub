"use client";

import { useState, useTransition } from "react";
import { Plus, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { DialogTrigger } from "@radix-ui/react-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createWorker, uploadPhoto } from "@/app/[locale]/worker/actions";
import { getInitials } from "@/lib/utils";

import { useRole } from "../role-provider";

export default function CreateWorkerDialog() {
  const t = useTranslations("workers.create");
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const initials = getInitials(fullName);
  const { isUser } = useRole();

  const resetForm = () => {
    setFullName("");
    setPhotoFile(null);
    setPhotoPreview(undefined);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleCreate = () => {
    if (!fullName.trim()) return;

    startTransition(async () => {
      try {
        const photoPath = await uploadPhoto(photoFile);
        await createWorker(fullName.trim(), photoPath);
        toast.success(t("success"));
      } catch {
        toast.error(t("error"));
      } finally {
        resetForm();
        setOpen(false);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) resetForm();
        setOpen(value);
      }}
    >
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
        <DialogDescription className="sr-only">
          {t("description")}
        </DialogDescription>

        <div className="space-y-4">
          {/* Full name */}
          <div className="space-y-2">
            <Label>{t("fullName")}</Label>
            <Input
              placeholder="Juan Pérez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Photo upload */}
          <div className="space-y-2">
            <Label>{t("photo")}</Label>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={photoPreview} />
                <AvatarFallback className="bg-secondary">
                  {initials ? initials : <Upload className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>

              <Input
                accept="image/*"
                type="file"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("cancel")}
          </Button>
          <Button
            disabled={!fullName.trim() || isPending}
            onClick={handleCreate}
          >
            {t("submit")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
