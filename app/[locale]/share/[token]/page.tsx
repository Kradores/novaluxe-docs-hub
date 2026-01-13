import { FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CheckAndDownloadButton } from "@/components/site-collection/check-collection-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getCollectionPreview } from "./actions";

type Props = {
  params: { token: string };
};

export default async function ShareCollectionPage({ params }: Props) {
  const t = await getTranslations("share");
  const { token } = await params;
  const collection = await getCollectionPreview(token);

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-10 space-y-10">
        {/* Documents List */}
        <CheckAndDownloadButton token={token} />
        {!!collection.companyDocuments.length && (
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("company.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {collection.companyDocuments.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-foreground">
                        {doc.documentType}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {doc.fileName}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        {!!collection.workerDocuments.length && (
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("workers.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-10">
              {collection.workerDocuments.map((worker, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 p-3 rounded-lg border border-secondary"
                >
                  <p className="font-serif text-foreground flex items-center gap-2">
                    {worker.workerName}
                  </p>
                  <ul className="space-y-2">
                    {worker.documents.map((doc) => (
                      <li
                        key={doc.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate text-foreground">
                            {doc.documentType}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {doc.fileName}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        {!!collection.uploadedDocuments.length && (
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-foreground flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                {t("attachments.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {collection.uploadedDocuments.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-foreground">
                        {"-"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {doc.file_name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
