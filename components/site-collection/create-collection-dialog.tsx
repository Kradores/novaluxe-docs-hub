"use client";

import { useMemo, useState, useTransition } from "react";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
import { assertDefined } from "@/lib/utils";
import { CollectionWorker } from "@/types/site-collection";
import useFetchWorkers from "@/hooks/use-fetch-workers";

import { Spinner } from "../ui/spinner";

import { CollectionUpload } from "./collection-upload";

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
  const t = useTranslations("constructionSiteDetail.create");
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
      } catch {
        toast.error(t("error"));
      }
    });
  };

  const workerMissingCount = (worker: CollectionWorker) => {
    const owned = worker.worker_documents.map((d) => d.worker_document_type_id);
    return workerDocTypeIds.filter((id) => !owned.includes(id)).length;
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>{t("openDialogLabel")}</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-full sm:max-w-2xl w-fit">
          <DialogHeader>
            <DialogTitle>{t("title")}</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("description")}
          </DialogDescription>

          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder={t("placeholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <DatePicker value={expiresAt} onValueChange={setExpiresAt} />
          </div>

          <Tabs defaultValue="company">
            <TabsList className="grid grid-cols-4 gap-3">
              <TabsTrigger value="company">
                {t("tabs.company.trigger")}
              </TabsTrigger>
              <TabsTrigger value="types">{t("tabs.types.trigger")}</TabsTrigger>
              <TabsTrigger value="workers">
                {t("tabs.workers.trigger")}
                {validSelectedWorkers.length > 0 && (
                  <Badge className="ml-1 h-5 px-1.5">
                    {validSelectedWorkers.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger className="gap-1" value="attachments">
                {t("tabs.attachments.trigger")}
                {attachments.length > 0 && (
                  <Badge className="ml-1 h-5 px-1.5" variant="secondary">
                    {attachments.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

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
                          {t("tabs.workers.missing", { count: missing })}
                        </span>
                      )}
                    </label>
                  );
                })}
              </TabsContent>
            )}

            <TabsContent className="space-y-3" value="attachments">
              <CollectionUpload
                attachments={attachments}
                setAttachments={setAttachments}
              />
            </TabsContent>
          </Tabs>

          <Button
            disabled={!name || !expiresAt || !hasContent || pending}
            onClick={handleCreate}
          >
            {t("submit")}
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
