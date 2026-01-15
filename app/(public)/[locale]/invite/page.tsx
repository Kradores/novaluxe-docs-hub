import { redirect } from "@/config/i18n/navigation";
import { allRoutes } from "@/config/site";
import { createSupabaseServerClient } from "@/integrations/supabase/server";

type Props = {
  searchParams: { token?: string };
  params: Promise<{ locale: string }>;
};

export default async function InvitePage({ searchParams, params }: Props) {
  const { locale } = await params;
  const token = searchParams.token;
  if (!token) redirect({ href: allRoutes.home, locale });

  const supabase = await createSupabaseServerClient();

  const { data: invite } = await supabase
    .from("user_invitations")
    .select("id")
    .eq("token", token)
    .is("accepted_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();

  if (!invite) {
    redirect({ href: allRoutes.inviteInvalid, locale });
  }

  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?token=${token}`,
    },
  });

  return null;
}
