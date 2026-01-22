"use client";

import { ActionDispatch, memo, useRef } from "react";
import { Paperclip, Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { formatFileSize } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  AttachmentsAction,
  FileWithProgress,
} from "./create-collection-dialog";

export type UploadedFile = {
  id: string;
  file_name: string;
};

type Props = {
  attachments: Map<string, FileWithProgress>;
  dispatch: ActionDispatch<[action: AttachmentsAction]>;
};

export const CollectionUpload = memo(({ attachments, dispatch }: Props) => {
  const t = useTranslations("constructionSiteDetail.create.tabs.attachments");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files!).forEach((file) => {
        if (
          !attachments
            .values()
            .find(({ file: stateFile }) => stateFile.name === file.name)
        ) {
          dispatch({
            type: "NEW_ATTACHMENT",
            payload: file,
          });
        }
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        {attachments.size === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            {t("noAttachments")}
          </p>
        ) : (
          Array.from(attachments.entries()).map(([key, atc]) => (
            <AttachmentItem
              key={key}
              attachment={atc}
              dispatch={dispatch}
              id={key}
            />
          ))
        )}
      </div>
    </>
  );
});

CollectionUpload.displayName = "CollectionUpload";

const AttachmentItem = memo(
  ({
    attachment,
    id,
    dispatch,
  }: {
    attachment: FileWithProgress;
    id: string;
    dispatch: ActionDispatch<[action: AttachmentsAction]>;
  }) => {
    const removeAttachment = (key: string) => {
      dispatch({
        type: "REMOVE_ATTACHMENT",
        payload: key,
      });
    };

    return (
      <div className="grid rounded-lg overflow-hidden">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50 col-start-1 row-start-1">
          <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">
              {attachment.file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(attachment.file.size)}
            </p>
          </div>
          <Button
            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
            size="sm"
            type="button"
            variant="ghost"
            onClick={() => removeAttachment(id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <Progress
          className="col-start-1 row-start-1 mb-0 mt-auto h-1"
          value={attachment.progress}
        />
      </div>
    );
  },
);

AttachmentItem.displayName = "AttachmentItem";
