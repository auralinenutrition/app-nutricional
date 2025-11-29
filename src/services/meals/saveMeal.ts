import { supabase } from "@/lib/supabase";

export type SaveMealPayload = {
  user_id: string;
  type?: string; // meal type: breakfast/lunch/etc
  title?: string;
  description?: string;
  time_string?: string | null;
  photo_url?: string | null;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  portion_size?: string | null;
  is_ai_suggested?: boolean;
  eaten_at?: string | null;
};

export default async function saveMeal(payload: SaveMealPayload) {
  const { error } = await supabase.from("meals").insert({
    user_id: payload.user_id,
    type: payload.type ?? "meal",
    title: payload.title ?? null,
    description: payload.description ?? null,
    photo_url: payload.photo_url ?? null,
    calories: payload.calories ?? null,
    protein: payload.protein ?? null,
    carbs: payload.carbs ?? null,
    fat: payload.fat ?? null,
    portion_size: payload.portion_size ?? null,
    is_ai_suggested: payload.is_ai_suggested ?? false,
    eaten_at: payload.eaten_at ?? new Date().toISOString(),
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
  return { success: true };
}
