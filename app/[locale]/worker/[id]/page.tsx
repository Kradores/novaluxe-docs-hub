import { getTranslations } from "next-intl/server";

import PageHeader from "@/components/page-header";
import { Worker } from "@/types/worker";
import CreateWorkerDialog from "@/components/workers/create-worker-dialog";
import { getWorkerById } from "./actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = await params;
  const t = await getTranslations("workers");
  const data: Worker = await getWorkerById(id);

  console.log(data);

  return (
    <>
      {/* <PageHeader action={<CreateWorkerDialog />} translationKey="workers" /> */}
      <div>{data.full_name}</div>
      <div>{data.status}</div>

      <div className="space-y-10">
        
      </div>
    </>
  );
}
