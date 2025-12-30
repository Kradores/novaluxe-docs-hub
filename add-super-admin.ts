import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const { data, error: roleError } = await supabase
  .from("roles")
  .select("id")
  .eq("name", "super_admin");

if (!data) {
  throw new Error("role super_admin is missing");
}

const {
  data: { user },
  error,
} = await supabase.auth.admin.createUser({
  email: process.env.AUTH_LOGIN!,
  password: process.env.AUTH_PASSWORD!,
  email_confirm: true,
  user_metadata: { name: "Nicolae" },
  app_metadata: { role: "super_admin" },
  role: "authenticated",
});

if (!user) {
  throw new Error("couldn't fetch user");
}

const { error: userRoleError } = await supabase.from("user_roles").insert({
  user_id: user.id,
  role_id: data[0].id,
});

// eslint-disable-next-line no-console
console.log(user, data, error, roleError, userRoleError);
