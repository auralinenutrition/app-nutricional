// src/services/upload/uploadImage.ts
import { supabase } from "@/lib/supabase";

export async function uploadMealImage(userId: string, file: File) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("user-uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error(uploadError);
      return { success: false, error: uploadError.message };
    }

    // pega a URL pública
    const { data } = supabase.storage
      .from("user-uploads")
      .getPublicUrl(filePath);

    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    console.error("uploadMealImage", err);
    return { success: false, error: err.message };
  }
}
