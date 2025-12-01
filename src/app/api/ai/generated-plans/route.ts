// src/app/api/ai/generated-plans/route.ts
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ hasPlan: false }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("ai_generated_plans")
    .select("id")
    .eq("user_id", user.id)
    .eq("plan_type", "weekly_meal_plan")
    .limit(1);

  if (error) {
    console.error("generated-plans error", error);
    return NextResponse.json({ hasPlan: false }, { status: 500 });
  }

  return NextResponse.json({ hasPlan: (data?.length ?? 0) > 0 });
}
