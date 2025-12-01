import { createServerSupabase } from "./server";

export async function getUserServer() {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}
