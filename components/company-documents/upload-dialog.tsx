"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { insertCompanyDocument } from "@/app/[locale]/company-documents/actions";
import { DatePicker } from "@/components/date-picker";

type Props = {
  documentTypes: { id: string; name: string }[];
};

export default function UploadDialog({ documentTypes }: Props) {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [typeId, setTypeId] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date>();
  const t = useTranslations("companyDocuments.upload");

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !typeId) return;

    const path = `${typeId}/${Date.now()}-${file.name}`;
    const supabase = createSupabaseBrowserClient();

    const { error } = await supabase.storage
      .from("documents")
      .upload(path, file);

    if (error) {
      toast.error(t("error"));
      console.error(error);
      return;
    }

    await insertCompanyDocument({
      company_document_type_id: typeId,
      file_path: path,
      file_name: file.name,
      file_type: file.type,
      expiration_date: expirationDate?.toISOString().substring(0, 10) || null,
    });

    toast.success(t("success"));
    setOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    setTypeId("");
    setExpirationDate(undefined);
    fileRef.current = null;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>{t("openDialogLabel")}</Button>
      </DialogTrigger>

      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          {t("description")}
        </DialogDescription>
        <div className="space-y-2">
          <Label>{t("documentType")}</Label>
          <Select onValueChange={setTypeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("expirationDate")}</Label>
          <DatePicker
            value={expirationDate}
            onValueChange={setExpirationDate}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("file")}</Label>
          <Input ref={fileRef} type="file" />
        </div>

        <DialogFooter>
          <Button disabled={!typeId} onClick={handleUpload}>
            {t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
