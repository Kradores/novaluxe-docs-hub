"use client";

import type { accounts, CredentialResponse } from "google-one-tap";

import Script from "next/script";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { useRouter } from "@/config/i18n/navigation";
import { allRoutes } from "@/config/site";
import { assignRole, isUserInvitedByEmail } from "@/app/(public)/[locale]/login/actions";

import { Button } from "./ui/button";

declare const google: { accounts: accounts };

const generateNonce = async (): Promise<string[]> => {
  const nonce = btoa(
    String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))),
  );
  const encoder = new TextEncoder();
  const encodedNonce = encoder.encode(nonce);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedNonce);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashedNonce = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return [nonce, hashedNonce];
};

export default function GoogleOneTap() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const initializeGoogleOneTap = async () => {
    const [nonce, hashedNonce] = await generateNonce();

    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session", error);
    }
    if (data.session) {
      router.push(allRoutes.home);
      return;
    }

    google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GMAIL_OAUTH_CLIENT_ID!,
      callback: async (response: CredentialResponse) => {
        try {
          const payload: { email?: string } = jwtDecode(response.credential);
          const isInvited = await isUserInvitedByEmail(payload.email);
          if (!isInvited) {
            router.replace("/invitation-required");
            return;
          }

          const { data, error } = await supabase.auth.signInWithIdToken({
            provider: "google",
            token: response.credential,
            nonce,
          });

          if (error) throw error;

          await assignRole(data.user);

          router.push(allRoutes.home);
        } catch (error) {
          console.error("Error logging in with Google One Tap", error);
        }
      },
      nonce: hashedNonce,
      // with chrome's removal of third-party cookies, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
      use_fedcm_for_prompt: false,
      log_level: "debug",
    });
    google.accounts.id.prompt(); // Display the One Tap UI
  };

  return (
    <>
      <Button className="w-full" onClick={initializeGoogleOneTap}>
        Login with Google
      </Button>
      <Script async src="https://accounts.google.com/gsi/client" />
    </>
  );
}
