"use client";

import { ReactNode, useState } from "react";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  collectionId: string;
  collectionName: string;
  children: ReactNode;
};

export default function CollectionDetailsDialog({
  collectionName,
  children,
}: Props) {
  const t = useTranslations("constructionSiteDetail.view");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="gap-1 size-9"
        title={t("buttonTitle")}
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{collectionName}</DialogTitle>
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}
