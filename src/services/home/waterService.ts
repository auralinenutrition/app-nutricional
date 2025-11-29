// src/services/home/waterService.ts
import { supabase } from "@/lib/supabase";

const addWaterRecord = async (userId: string, ml: number) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("water_records").insert({
      user_id: userId,
      amount: ml,
      date: today,
      created_at: new Date().toISOString(),
    });

    if (error) return { success: false, error: error.message };

    return { success: true };
  } catch (err: any) {
    console.error("addWaterRecord", err);
    return { success: false, error: err.message || String(err) };
  }
};

export default {
  addWaterRecord,
};
