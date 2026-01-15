"use server";

import { createSupabaseServerClient } from "@/integrations/supabase/server";

export async function signInWithEmail() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: "kradores10@gmail.com",
    options: {
      // set this to false if you do not want the user to be automatically signed up
      shouldCreateUser: false,
      emailRedirectTo: process.env.NEXT_PUBLIC_URL,
    },
  });

  console.log(error)

  if (error) throw error.message;

  return data;
}
