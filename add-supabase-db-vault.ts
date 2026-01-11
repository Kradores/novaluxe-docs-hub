import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setVaultSecret(name: string, value: string) {
  const { data, error } = await supabase.rpc("manage_vault_secret", {
    secret_name: name,
    secret_value: value,
    secret_description: "Automated via deploy script",
  });

  if (error) throw error;
  return `Secret ${name}: ${data}`;
}

setVaultSecret("kong_url", process.env.NEXT_PUBLIC_KONG_URL!)
  .then((response) => console.log(response))
  .catch((err) => console.error("❌ Error updating Vault:", err));

setVaultSecret("anon_key", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  .then((response) => console.log(response))
  .catch((err) => console.error("❌ Error updating Vault:", err));
