"use client";

import { Link } from "lucide-react";

import { CopyButton } from "../ui/shadcn-io/copy-button";

export default function CopyLinkButton({ token }: { token: string }) {
  return (
    <CopyButton
      CustomCopyIcon={Link}
      content={`${process.env.NEXT_PUBLIC_URL}/share/${token}`}
      title="Copy link"
      variant={"outline"}
      className="size-9"
    />
  );
}
