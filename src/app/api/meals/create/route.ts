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

    const body = await req.json().catch(() => null);

    if (!body || !body.image_url) {
      return NextResponse.json(
        { error: "Payload inválido" },
        { status: 400 }
      );
    }

    // Sanitização
    const payload = {
      user_id: user.id,
      title: String(body.title ?? "").slice(0, 100),
      type: String(body.type ?? "").slice(0, 50),
      image_url: String(body.image_url),
      description: String(body.description ?? "").slice(0, 500),
      calories: Number(body.calories ?? 0),
      protein: Number(body.protein ?? 0),
      carbs: Number(body.carbs ?? 0),
      fat: Number(body.fat ?? 0),
      portion_size: String(body.portion_size ?? "").slice(0, 50),
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("meals")
      .insert(payload)
      .select();

    if (error) {
      console.error("❌ Erro Supabase:", error);
      return NextResponse.json(
        { error: "Erro ao salvar refeição" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, meal: data });

  } catch (err: any) {
    console.error("❌ Erro interno create:", err);
    return NextResponse.json(
      { error: "Erro interno", details: err.message },
      { status: 500 }
    );
  }
}
