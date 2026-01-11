import { CheckAndDownloadButton } from "@/components/site-collection/check-collection-button";

import { getCollectionPreview } from "./actions";

const maxSeconds = Number.parseInt(
  process.env.MAX_SECONDS_FILE_DOWNLOAD ?? "60",
);

type Props = {
  params: { token: string };
};

export default async function ShareCollectionPage({ params }: Props) {
  const { token } = await params;
  const collection = await getCollectionPreview(token);

  // if (isExpired) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center space-y-2">
  //         <h1 className="text-xl font-semibold">Link expired</h1>
  //         <p className="text-sm text-muted-foreground">
  //           This document collection is no longer available.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 space-y-10">
        {/* Company Documents */}
        <section>
          <h2 className="text-xl font-semibold">Company documents</h2>

          <div className="space-y-4">
            {collection.companyDocuments.map((group) => (
              <div key={group.documentType}>
                <h3 className="font-medium">{group.documentType}</h3>

                <ul className="ml-4 list-disc text-sm text-muted-foreground">
                  {group.documents.map((doc) => (
                    <li key={doc.fileName}>{doc.fileName}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Worker Documents */}
        <section>
          <h2 className="text-xl font-semibold">Worker documents</h2>

          <div className="space-y-6">
            {collection.workerDocuments.map((worker) => (
              <div key={worker.workerName}>
                <h3 className="font-medium">{worker.workerName}</h3>

                <div className="ml-4 space-y-3">
                  {worker.documents.map((docType) => (
                    <div key={docType.documentType}>
                      <p className="text-sm font-medium">
                        {docType.documentType}
                      </p>

                      <ul className="ml-4 list-disc text-sm text-muted-foreground">
                        {docType.files.map((file) => (
                          <li key={file.fileName}>{file.fileName}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <CheckAndDownloadButton token={token} />
      </div>
    </main>
  );
}
