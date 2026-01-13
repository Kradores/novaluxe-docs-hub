"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { AlertCircle, Paperclip, Upload, X } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { createCollection } from "@/app/[locale]/construction-site/[id]/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/date-picker";
import { assertDefined, formatFileSize } from "@/lib/utils";
import { CollectionWorker } from "@/types/site-collection";
import useFetchWorkers from "@/hooks/use-fetch-workers";

import { Spinner } from "../ui/spinner";

type CreateCollectionDialogProps = {
  siteId: string;
  companyDocuments: {
    id: string;
    file_name: string;
    company_document_types: { id: string; name: string };
  }[];
  workerDocumentTypes: { id: string; name: string }[];
};

export default function CreateCollectionDialog({
  siteId,
  companyDocuments,
  workerDocumentTypes,
}: CreateCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
    defaultExpirationDate,
  );
  const [companyDocIds, setCompanyDocIds] = useState<string[]>([]);
  const [workerDocTypeIds, setWorkerDocTypeIds] = useState<string[]>([]);
  const { workers, isLoading } = useFetchWorkers(workerDocTypeIds);
  const [workerIds, setWorkerIds] = useState<string[]>([]);

  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validSelectedWorkers = useMemo(() => {
    const eligibleIds = new Set(workers.map((w) => w.id));
    return workerIds.filter((id) => eligibleIds.has(id));
  }, [workers, workerIds]);

  const hasContent =
    companyDocIds.length > 0 ||
    (workerDocTypeIds.length > 0 && validSelectedWorkers.length > 0);

  const toggle = (arr: string[], id: string) =>
    arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id];

  const handleCreate = () => {
    assertDefined(expiresAt, "expiresAt");
    startTransition(async () => {
      try {
        await createCollection({
          siteId,
          name,
          expiresAt: expiresAt,
          companyDocumentIds: companyDocIds,
          workerDocumentTypeIds: workerDocTypeIds,
          workerIds: validSelectedWorkers,
          files: attachments,
        });

        setOpen(false);
        setName("");
        setCompanyDocIds([]);
        setWorkerDocTypeIds([]);
        setWorkerIds([]);
      } catch (error) {
        if (typeof error === "string") {
          toast.error(error);
        } else {
          console.error(error);
        }
      }
    });
  };

  const workerMissingCount = (worker: CollectionWorker) => {
    const owned = worker.worker_documents.map((d) => d.worker_document_type_id);
    return workerDocTypeIds.filter((id) => !owned.includes(id)).length;
  };

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
      <Button onClick={() => setOpen(true)}>Create collection</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-full sm:max-w-2xl w-fit">
          <DialogHeader>
            <DialogTitle>Create document collection</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-muted-foreground">
            Collect all the documents that you would like to create a link for
          </DialogDescription>

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder="Collection name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <DatePicker value={expiresAt} onValueChange={setExpiresAt} />
          </div>

          <Tabs defaultValue="company">
            <TabsList className="grid grid-cols-4 gap-3">
              <TabsTrigger value="company">Company docs</TabsTrigger>
              <TabsTrigger value="types">Worker doc types</TabsTrigger>
              <TabsTrigger value="workers">
                Workers
                {validSelectedWorkers.length > 0 && (
                  <Badge className="ml-1 h-5 px-1.5">
                    {validSelectedWorkers.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger className="gap-1" value="attachments">
                Attachments
                {attachments.length > 0 && (
                  <Badge className="ml-1 h-5 px-1.5" variant="secondary">
                    {attachments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Company documents */}
            <TabsContent className="max-h-48 overflow-y-auto" value="company">
              {companyDocuments.map((doc) => (
                <label
                  key={doc.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                >
                  <Checkbox
                    checked={companyDocIds.includes(doc.id)}
                    onCheckedChange={() =>
                      setCompanyDocIds((p) => toggle(p, doc.id))
                    }
                  />
                  <div>
                    <p className="text-sm font-medium">
                      {doc.company_document_types.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {doc.file_name}
                    </p>
                  </div>
                </label>
              ))}
            </TabsContent>

            {/* Worker document types */}
            <TabsContent className="max-h-48 overflow-y-auto" value="types">
              {workerDocumentTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                >
                  <Checkbox
                    checked={workerDocTypeIds.includes(type.id)}
                    onCheckedChange={() =>
                      setWorkerDocTypeIds((p) => toggle(p, type.id))
                    }
                  />
                  <span className="text-sm">{type.name}</span>
                </label>
              ))}
            </TabsContent>

            {/* Workers */}
            {isLoading ? (
              <TabsContent
                className="flex justify-center items-center"
                value="workers"
              >
                <Spinner className="w-4 h-4" />
              </TabsContent>
            ) : (
              <TabsContent className="max-h-48 overflow-y-auto" value="workers">
                {workers.map((worker) => {
                  const missing = workerMissingCount(worker);

                  return (
                    <label
                      key={worker.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                    >
                      <Checkbox
                        checked={validSelectedWorkers.includes(worker.id)}
                        onCheckedChange={() =>
                          setWorkerIds((p) => toggle(p, worker.id))
                        }
                      />
                      <span className="flex-1 text-sm">{worker.full_name}</span>

                      {workerDocTypeIds.length > 0 && missing > 0 && (
                        <span className="text-xs text-amber-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {missing} missing
                        </span>
                      )}
                    </label>
                  );
                })}
              </TabsContent>
            )}

            <TabsContent className="space-y-3" value="attachments">
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
                {"siteDetail.addAttachments"}
              </Button>

              <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-border p-3 bg-secondary/30">
                {attachments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {"siteDetail.noAttachments"}
                  </p>
                ) : (
                  attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50"
                    >
                      <Paperclip className="h-4 w-4 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {file.name}
                        </p>
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
            </TabsContent>
          </Tabs>

          <Button
            disabled={!name || !expiresAt || !hasContent || pending}
            onClick={handleCreate}
          >
            Create collection
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}

function defaultExpirationDate() {
  const date = new Date();
  date.setDate(date.getDate() + 2);

  return date;
}
