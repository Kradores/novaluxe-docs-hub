"use client";

import { ReactNode, useState } from "react";
import { Eye } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="gap-1"
        size="sm"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Eye className="h-4 w-4" />
        View
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
