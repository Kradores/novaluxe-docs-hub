import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createBrowserSignedUrl } from "@/integrations/supabase/client-signed-url";
import { createSupabaseServerClient } from "@/integrations/supabase/server";
import { getInitials } from "@/lib/utils";
import { Worker } from "@/types/worker";

const maxSeconds = Number.parseInt(
  process.env.MAX_SECONDS_FILE_DOWNLOAD ?? "60",
);

interface WorkerAvatarProps {
  worker: Worker;
}

export default async function WorkerAvatar({ worker }: WorkerAvatarProps) {
  if (!worker.photo_path) {
    return (
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-secondary text-sm font-medium">
          {getInitials(worker.full_name)}
        </AvatarFallback>
      </Avatar>
    );
  }

  const signedUrl = await createBrowserSignedUrl("worker-photos", worker.photo_path, maxSeconds);

  return (
    <Avatar className="h-12 w-12 ring-2 ring-primary/20">
      <AvatarImage alt={worker.full_name} src={signedUrl} />
      <AvatarFallback className="bg-secondary text-sm font-medium">
        {getInitials(worker.full_name)}
      </AvatarFallback>
    </Avatar>
  );
}
