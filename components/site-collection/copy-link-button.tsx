"use client";

import { Link } from "lucide-react";
import { useTranslations } from "next-intl";

import { CopyButton } from "@/components/ui/shadcn-io/copy-button";

export default function CopyLinkButton({ token }: { token: string }) {
  const t = useTranslations("constructionSiteDetail");
  return (
    <CopyButton
      CustomCopyIcon={Link}
      className="size-9"
      content={`${process.env.NEXT_PUBLIC_URL}/share/${token}`}
      title={t("copyLink")}
      variant={"outline"}
    />
  );
}
