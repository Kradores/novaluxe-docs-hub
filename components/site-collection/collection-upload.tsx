"use client";

import { Dispatch, SetStateAction, useRef } from "react";
import { Paperclip, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type UploadedFile = {
  id: string;
  file_name: string;
};

type Props = {
  attachments: File[];
  setAttachments: Dispatch<SetStateAction<File[]>>;
};

export const CollectionUpload = ({ attachments, setAttachments }: Props) => {
  const t = useTranslations("constructionSiteDetail.create.tabs.attachments");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <input
        ref={fileInputRef}
        multiple
        className="hidden"
        type="file"
        onChange={handleFileSelect}
      />
      <Button
        className="w-full gap-2 border-dashed"
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        {t("addAttachments")}
      </Button>

      <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-border p-3 bg-secondary/30">
        {attachments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("noAttachments")}
          </p>
        ) : (
          attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50"
            >
              <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                size="sm"
                type="button"
                variant="ghost"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </>
  );
};
