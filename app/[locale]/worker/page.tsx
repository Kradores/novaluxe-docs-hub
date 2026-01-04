import { getTranslations } from "next-intl/server";

import PageHeader from "@/components/page-header";
import { Worker } from "@/types/worker";
import WorkersSection from "@/components/workers/workers-section";
import CreateWorkerDialog from "@/components/workers/create-worker-dialog";
import { allRoutes } from "@/config/site";

import { getWorkers } from "./actions";

export default async function Page() {
  const t = await getTranslations("workers");
  const data = await getWorkers();

  const workers: Worker[] =
    data.map((w) => ({
      ...w,
      document_count: w.worker_documents?.length ?? 0,
    })) ?? [];

  const active = workers.filter((w) => w.status === "active");
  const laidOff = workers.filter((w) => w.status === "laidOff");

  return (
    <>
      <PageHeader
        action={<CreateWorkerDialog />}
        backTo={allRoutes.home}
        subtitle={t.has("subtitle") && t("subtitle")}
        title={t("title")}
      />

      <div className="space-y-10">
        <WorkersSection
          badgeVariant="success"
          noWorkersText={t("noActiveWorkers")}
          title={t("activeWorkers")}
          workers={active}
        />

        <WorkersSection
          badgeVariant="warning"
          noWorkersText={t("noLaidOffWorkers")}
          title={t("laidOffWorkers")}
          workers={laidOff}
        />
      </div>
    </>
  );
}
