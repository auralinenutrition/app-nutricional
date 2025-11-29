import { supabase } from "@/lib/supabase";

const addMeal = async (
  userId: string,
  meal: { title: string; description: string; calories: number }
) => {
  try {
    const { error } = await supabase.from("meals").insert({
      user_id: userId,
      title: meal.title,
      description: meal.description,
      calories: meal.calories,
      created_at: new Date().toISOString(),
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message ?? String(err) };
  }
};

export default { addMeal };
