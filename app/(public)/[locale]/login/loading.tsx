import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh">
      <Spinner className="size-10" />
    </div>
  );
}
