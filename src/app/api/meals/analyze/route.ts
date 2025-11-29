import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    const prompt = `
Você é um nutricionista.
Analise a refeição da imagem e retorne SOMENTE um JSON PURO e VÁLIDO com:

{
  "description": "string",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "portion_size": "string"
}

Regras:
- Não adicione explicações.
- Não use markdown.
- Não coloque crases.
- Retorne somente o JSON.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Você é um nutricionista." },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ],
        },
      ],
      temperature: 0.1,
      max_tokens: 400,
    });

    let output = response.choices[0].message.content ?? "";

    // --- LIMPA POSSÍVEIS LIXOS ---
    output = output.trim();

    // Extrai bloco JSON entre chaves
    const jsonMatch = output.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) {
      console.error("❌ JSON não encontrado na resposta:", output);
      throw new Error("Resposta da IA não contém JSON válido.");
    }

    const jsonString = jsonMatch[0];

    // Faz parse seguro
    const data = JSON.parse(jsonString);

    return NextResponse.json(data);

  } catch (err: any) {
    console.error("❌ Erro na rota analyze:", err);
    return NextResponse.json(
      {
        error: "Erro ao analisar refeição",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
