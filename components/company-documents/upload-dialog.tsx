"use client";

import { useCallback, useRef, useState } from "react";
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
import { useRole } from "@/components/role-provider";
import { uploadFileTus } from "@/lib/upload-tus";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";

type Props = {
  documentTypes: { id: string; name: string }[];
};

export default function UploadDialog({ documentTypes }: Props) {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [typeId, setTypeId] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date>();
  const t = useTranslations("companyDocuments.upload");
  const { isUser } = useRole();
  const [progress, setProgress] = useState(0);

  const handleUpload = useCallback(async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !typeId) return;

    const objectPath = `${typeId}/${Date.now()}-${file.name}`;
    const supabase = createSupabaseBrowserClient();

    await uploadFileTus({
      supabase,
      file,
      bucket: "documents",
      objectPath,
      onProgress: setProgress,
    });

    await insertCompanyDocument({
      company_document_type_id: typeId,
      file_path: objectPath,
      file_name: file.name,
      file_type: file.type,
      expiration_date: expirationDate?.toISOString().substring(0, 10) || null,
    });

    toast.success(t("success"));
    setOpen(false);
  }, [fileRef, typeId, expirationDate, t]);

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    setTypeId("");
    setExpirationDate(undefined);
    setProgress(0);
    fileRef.current = null;
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {!isUser && (
          <Button onClick={() => setOpen(true)}>{t("openDialogLabel")}</Button>
        )}
      </DialogTrigger>

      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          {t("description")}
        </DialogDescription>
        <div className="grid overflow-hidden">
          <div className="col-start-1 row-start-1 space-y-4">
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
          </div>
          {progress > 0 && (
            <div className="col-start-1 row-start-1 bg-background/95" />
          )}
        </div>
        <DialogFooter>
          {progress > 0 && (
            <div className="flex flex-col gap-2 justify-end w-full">
              <Label
                className="self-end"
                htmlFor="progress-upload"
              >{`${progress}%`}</Label>
              <Progress className="h-1" id="progress-upload" value={progress} />
            </div>
          )}
          <Button disabled={!typeId || progress > 0} onClick={handleUpload}>
            {progress > 0 ? <Spinner /> : t("submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
