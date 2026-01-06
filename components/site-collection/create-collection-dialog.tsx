"use client";

import { useState, useTransition } from "react";
import { AlertCircle } from "lucide-react";

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

type Props = {
  siteId: string;
  companyDocuments: {
    id: string;
    file_name: string;
    company_document_types: { id: string; name: string };
  }[];
  workerDocumentTypes: { id: string; name: string }[];
  workers: {
    id: string;
    full_name: string;
    worker_documents: { worker_document_type_id: string }[];
  }[];
};

export default function CreateCollectionDialog({
  siteId,
  companyDocuments,
  workerDocumentTypes,
  workers,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
    defaultExpirationDate,
  );
  const [companyDocIds, setCompanyDocIds] = useState<string[]>([]);
  const [workerDocTypeIds, setWorkerDocTypeIds] = useState<string[]>([]);
  const [workerIds, setWorkerIds] = useState<string[]>([]);

  const hasContent =
    companyDocIds.length > 0 ||
    (workerDocTypeIds.length > 0 && workerIds.length > 0);

  const toggle = (arr: string[], id: string) =>
    arr.includes(id) ? arr.filter((i) => i !== id) : [...arr, id];

  const handleCreate = () => {
    assertDefined(expiresAt, "expiresAt");
    startTransition(async () => {
      await createCollection({
        siteId,
        name,
        expiresAt: expiresAt,
        companyDocumentIds: companyDocIds,
        workerDocumentTypeIds: workerDocTypeIds,
        workerIds,
      });

      setOpen(false);
      setName("");
      setCompanyDocIds([]);
      setWorkerDocTypeIds([]);
      setWorkerIds([]);
    });
  };

  const workerMissingCount = (worker: Props["workers"][0]) => {
    const owned = worker.worker_documents.map((d) => d.worker_document_type_id);
    return workerDocTypeIds.filter((id) => !owned.includes(id)).length;
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create collection</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
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
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="company">Company docs</TabsTrigger>
              <TabsTrigger value="types">Worker doc types</TabsTrigger>
              <TabsTrigger value="workers">
                Workers
                {workerIds.length > 0 && (
                  <Badge className="ml-1">{workerIds.length}</Badge>
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
            <TabsContent className="max-h-48 overflow-y-auto" value="workers">
              {workers.map((worker) => {
                const missing = workerMissingCount(worker);

                return (
                  <label
                    key={worker.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                  >
                    <Checkbox
                      checked={workerIds.includes(worker.id)}
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
