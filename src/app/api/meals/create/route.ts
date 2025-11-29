import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    console.log("📩 Dados recebidos:", body);

    const payload = {
      user_id: user.id,
      title: body.title,          
      type: body.type,            
      image_url: body.image_url, 
      description: body.description,
      calories: body.calories,
      protein: body.protein,
      carbs: body.carbs,
      fat: body.fat,
      portion_size: body.portion_size,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("meals")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("❌ Erro Supabase:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log("✔️ Refeição salva:", data);
    return NextResponse.json(data);

  } catch (err: any) {
    console.error("❌ Erro create:", err);
    return NextResponse.json(
      { error: "Erro interno", details: err.message },
      { status: 500 }
    );
  }
}
