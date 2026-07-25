import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_STORAGE_KEY } from "./constants";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseServerClient {
  private static instance: SupabaseClient | null = null;

  public static async getInstance() {
    if (!SupabaseServerClient.instance) {
      const cookieStore = await cookies();
      SupabaseServerClient.instance = createServerClient(
        process.env.SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
              try {
                cookiesToSet.forEach(({ name, value, options }) =>
                  cookieStore.set(name, value, options),
                );
              } catch {}
            },
          },
          auth: {
            storageKey: SUPABASE_STORAGE_KEY,
          }
        },
      );
    }
    return SupabaseServerClient.instance;
  }
}

/**
 * Creates an instance of the Supabase server client.
 * @deprecated Use `SupabaseServerClient.getInstance()` instead.
 * This function will be removed in a future version.
 * @returns {Promise<SupabaseClient>} A promise that resolves to the Supabase client instance.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
      auth: {
        storageKey: SUPABASE_STORAGE_KEY,
      }
    },
  );
}
