"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { useRouter } from "@/config/i18n/navigation";
import { allRoutes } from "@/config/site";

import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export default function GoogleOneTap() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function checkSession() {
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        router.push(allRoutes.home);
        return;
      }
      setIsLoading(false);
    }
    checkSession();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Points back to your Next.js application route
        redirectTo: `${window.location.origin}/${allRoutes.assignRole}`,
      },
    });

    if (error) {
      toast.error("Error getting session");
    }
    setIsLoading(false);
  };

  return (
    <Button
      className="w-full"
      disabled={isLoading}
      onClick={handleLogin}
    >
      {isLoading ? <Spinner /> : "Login with Google"}
    </Button>
  );
}
