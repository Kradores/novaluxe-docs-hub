import { createSupabaseServerClient } from "./server";

export const createBrowserSignedUrl = async (
    bucket: string,
    path: string,
    expiresIn: number,
) => {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

    if (error) throw error;

    return data.signedUrl.replace(
        process.env.SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
    );
};