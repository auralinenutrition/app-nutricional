import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function analyzeMeal(imageUrl: string) {
  const prompt = `
Você é um nutricionista. Analise a refeição da imagem e retorne APENAS um JSON:

{
  "description": string,
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "portion_size": string
}

Sem explicações.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Você é um nutricionista."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 512,
      temperature: 0.2
    });

    const text = response.choices[0].message.content;
    return JSON.parse(text ?? "");

  } catch (err) {
    console.error("Erro ao analisar refeição:", err);
    throw err;
  }
}
