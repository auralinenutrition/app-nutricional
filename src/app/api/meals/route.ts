import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { imageUrl, timeOfDay } = body;

    if (!imageUrl) return NextResponse.json({ error: "imageUrl missing" }, { status: 400 });

    // Prompt — pedimos JSON estrito
    const prompt = `
You are a nutrition assistant. Analyze the food in the provided image URL and return EXACTLY a JSON object with the following keys:
"title": string - short meal title (e.g. "Café da manhã", "Frango grelhado"),
"calories": number | null,
"protein": number | null,
"carbs": number | null,
"fat": number | null,
"portion_size": string | null,
"description": string | null - short natural description,
"is_ai_suggested": true,
"ai_version": string

If you can't estimate a numeric value, return null for that field. DO NOT output text outside the JSON. Only return the JSON object.

Image URL: ${imageUrl}
Context: timeOfDay = ${timeOfDay ?? "unknown"}
`;

    // Call OpenAI Responses API (simple fetch). Adjust model name as needed.
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) return NextResponse.json({ error: "OpenAI key not configured" }, { status: 500 });

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-vision", // ou o model apropriado que você tem disponível
        input: [
          { role: "user", content: prompt }
        ],
        // você pode ajustar temperature, max_tokens, etc.
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      return NextResponse.json({ error: "OpenAI error", details: txt }, { status: 500 });
    }

    const data = await response.json();

    // A resposta pode vir de formatos diferentes dependendo do modelo.
    // Tentamos extrair texto e parsear JSON
    let textOutput = "";

    // vários modelos retornam em data.output[0].content[0].text, ou .content[0].parts
    try {
      const out = data.output ?? data.choices ?? data;
      // bruteforce extraction:
      if (Array.isArray(data.output)) {
        textOutput = data.output.map((o: any) => {
          if (o.content) return JSON.stringify(o.content);
          return String(o);
        }).join("\n");
      } else if (data.output?.[0]?.content?.[0]?.text) {
        textOutput = data.output[0].content[0].text;
      } else if (data.choices?.[0]?.message?.content?.[0]?.text) {
        textOutput = data.choices[0].message.content[0].text;
      } else if (typeof data?.output?.[0] === "string") {
        textOutput = data.output[0];
      } else {
        // fallback: stringify everything (we'll try to find JSON inside)
        textOutput = JSON.stringify(data);
      }
    } catch (err) {
      textOutput = JSON.stringify(data);
    }

    // try to extract JSON substring from textOutput
    const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : textOutput;

    let parsed: any = null;
    try {
      parsed = JSON.parse(jsonText);
    } catch (err) {
      // if parse failed, return error with raw text for debugging
      return NextResponse.json({ error: "Could not parse model JSON", raw: textOutput }, { status: 500 });
    }

    // Normalize fields
    const result = {
      title: parsed.title ?? "",
      calories: parsed.calories ?? null,
      protein: parsed.protein ?? null,
      carbs: parsed.carbs ?? null,
      fat: parsed.fat ?? null,
      portion_size: parsed.portion_size ?? null,
      description: parsed.description ?? null,
      is_ai_suggested: true,
      ai_version: parsed.ai_version ?? "vision-unknown",
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("meal-insight error", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
