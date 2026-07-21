import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_STORAGE_KEY } from "./constants";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (client) {
    return client;
  }


  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey: SUPABASE_STORAGE_KEY,
      }
    }
  );

  return client;
}