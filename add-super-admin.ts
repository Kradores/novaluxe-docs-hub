import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error } = await supabase.auth.admin.createUser({
  email: process.env.AUTH_LOGIN!,
  password: process.env.AUTH_PASSWORD!,
  email_confirm: true,
  user_metadata: {},
  app_metadata: { role: "super_admin" },
});

// eslint-disable-next-line no-console
console.log(data, error);
