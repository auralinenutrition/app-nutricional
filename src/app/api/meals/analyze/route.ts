import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.imageUrl) {
      return NextResponse.json({ error: "imageUrl obrigatório" }, { status: 400 });
    }

    const imageUrl = String(body.imageUrl);

    if (!/^https?:\/\//.test(imageUrl)) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    const prompt = `
Analise a refeição e retorne SOMENTE JSON:

{
  "description": "string",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "portion_size": "string"
}
`;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      max_tokens: 300,
      messages: [
        { role: "system", content: "Você é um nutricionista." },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    });

    const raw = aiResponse.choices[0].message.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);

    if (!match) return NextResponse.json({ error: "IA não retornou JSON válido" }, { status: 500 });

    const parsed = JSON.parse(match[0]);

    return NextResponse.json({
      description: parsed.description ?? "",
      calories: Number(parsed.calories ?? 0),
      protein: Number(parsed.protein ?? 0),
      carbs: Number(parsed.carbs ?? 0),
      fat: Number(parsed.fat ?? 0),
      portion_size: parsed.portion_size ?? "",
    });
  } catch (err: any) {
    console.error("analyze error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
