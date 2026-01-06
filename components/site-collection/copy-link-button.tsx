"use client";

import { Button } from "@/components/ui/button";

export default function CopyLinkButton({ token }: { token: string }) {
  const copy = () =>
    navigator.clipboard.writeText(`${window.location.origin}/share/${token}`);

  return (
    <Button size="sm" variant="outline" onClick={copy}>
      Copy link
    </Button>
  );
}
