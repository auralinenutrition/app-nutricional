// src/services/meals/uploadMealPhoto.ts
import { createClient } from "@/lib/supabase/client";
import { v4 as uuid } from "uuid";

export async function uploadMealPhoto(userId: string, file: File) {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const fileName = `${uuid()}.${fileExt}`;
  const filePath = `${userId}/meal-photos/${fileName}`;

  // Upload real
  const { error: uploadErr } = await supabase.storage
    .from("user-uploads")
    .upload(filePath, file, { upsert: false });

  if (uploadErr) {
    console.error("❌ Erro no upload da foto:", uploadErr);
    throw uploadErr;
  }

  // URL pública
  const { data } = supabase.storage
    .from("user-uploads")
    .getPublicUrl(filePath);

  return {
    filePath,
    publicUrl: data.publicUrl,
  };
}
