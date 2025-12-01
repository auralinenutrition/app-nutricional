// src/app/api/ai/generate-plan/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerSupabase } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
  auth: { persistSession: false },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

function safeExtractJson(text: string) {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    try {
      const cleaned = match[0].replace(/\s+/g, " ");
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}

/* -----------------------------------------------------
   FUNÇÃO CRÍTICA: NORMALIZA TUDO QUE A IA GERA
------------------------------------------------------ */
function normalizeWeek(rawWeek: any) {
  const days = [
    "domingo",
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  const normalizeMeal = (item: any) => {
    if (typeof item === "string") {
      return {
        title: item,
        description: "",
        calories: 0,
      };
    }

    return {
      title: String(item?.title ?? ""),
      description: String(item?.description ?? ""),
      calories: Number(item?.calories ?? 0),
    };
  };

  const finalWeek: any = {};

  for (const day of days) {
    const raw = rawWeek?.[day] ?? [];
    finalWeek[day] = Array.isArray(raw) ? raw.map(normalizeMeal) : [];
  }

  return finalWeek;
}

/* -----------------------------------------------------
   ROTA PRINCIPAL
------------------------------------------------------ */
export async function POST() {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // buscar quiz
    const { data: quiz } = await supabase
      .from("quiz_responses")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 400 });
    }

    // prompt IA
    const prompt = `
Gere APENAS UM JSON. 
Formato obrigatório:

{
  "metas": { "meta_agua": number, "meta_calorias": number, "meta_refeicoes": number },
  "week": {
    "domingo": [...],
    "segunda": [...],
    "terca": [...],
    "quarta": [...],
    "quinta": [...],
    "sexta": [...],
    "sabado": [...]
  },
  "shopping_list": ["..."]
}

Cada refeição DEVE SER um objeto:
{
  "title": "...",
  "description": "",
  "calories": 0
}

Quiz:
${JSON.stringify(quiz)}
`;

    const aiResp = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.1,
      max_tokens: 1400,
      messages: [
        { role: "system", content: "Você é um nutricionista especialista." },
        { role: "user", content: prompt },
      ],
    });

    const rawText = aiResp.choices[0]?.message?.content ?? "";
    const parsed = safeExtractJson(rawText);

    if (!parsed) {
      return NextResponse.json({ error: "Invalid AI JSON" }, { status: 500 });
    }

    // NORMALIZAÇÃO FUNDAMENTAL
    const finalWeek = normalizeWeek(parsed.week);

    const plan = {
      metas: {
        meta_agua: Number(parsed.metas?.meta_agua ?? 2000),
        meta_calorias: Number(parsed.metas?.meta_calorias ?? 2000),
        meta_refeicoes: Number(parsed.metas?.meta_refeicoes ?? 4),
      },
      week: finalWeek,
      shopping_list: parsed.shopping_list ?? [],
    };

    // salvar no banco
    const { data: saved, error: saveErr } = await supabaseAdmin
      .from("ai_generated_plans")
      .insert([
        {
          user_id: userId,
          plan_type: "weekly_meal_plan",
          content: plan,
        },
      ])
      .select()
      .single();

    if (saveErr) {
      console.error("save plan error:", saveErr);
      return NextResponse.json(
        { error: "Failed to save plan" },
        { status: 500 }
      );
    }

    // Atualizar metas no users
    await supabaseAdmin
      .from("users")
      .update({
        meta_agua: plan.metas.meta_agua,
        meta_calorias: plan.metas.meta_calorias,
        meta_refeicoes: plan.metas.meta_refeicoes,
      })
      .eq("id", userId);

    return NextResponse.json({ success: true, plan_id: saved.id, plan });
  } catch (err: any) {
    console.error("generate-plan error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
