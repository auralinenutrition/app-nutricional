import { createClient } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Buscar apenas refeições do dia atual
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", startOfDay.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
