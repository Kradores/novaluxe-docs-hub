'use server'

import { allRoutes } from '@/config/site'
import { createSupabaseServerClient } from '@/integrations/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))

  const supabase = await createSupabaseServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message };
  }

  redirect(allRoutes.dashboard);
}
