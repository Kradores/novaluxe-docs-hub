import { getTranslations } from "next-intl/server";

import PageHeader from "@/components/page-header";
import { Worker } from "@/types/worker";
import { allRoutes } from "@/config/site";

import { getWorkerById } from "./actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("worker");
  const data: Worker = await getWorkerById(id);

  return (
    <>
      <PageHeader
        // action={<CreateWorkerDialog />}
        backTo={allRoutes.worker}
        subtitle={data.status}
        title={data.full_name}
      />
      <div className="space-y-10" />
    </>
  );
}
