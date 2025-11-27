// src/services/home/MealPlanMock.ts
export type AiDayMeal = {
  title: string;        // "Café da manhã", "Almoço", ...
  description?: string;
  calories?: number;
};

type DayKey =
  | "domingo"
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado";

export type AiPlanDays = {
  domingo: AiDayMeal[];
  segunda: AiDayMeal[];
  terca: AiDayMeal[];
  quarta: AiDayMeal[];
  quinta: AiDayMeal[];
  sexta: AiDayMeal[];
  sabado: AiDayMeal[];
};

export async function loadWeeklyPlanMock(): Promise<AiPlanDays> {
  // retorne um mock realista; async para compatibilidade com service real
  return {
    domingo: [
      { title: "Café da manhã", description: "Ovos mexidos + pão integral", calories: 320 },
      { title: "Almoço", description: "Frango grelhado + arroz + salada", calories: 520 },
      { title: "Café da tarde", description: "Iogurte natural + frutas", calories: 180 },
      { title: "Jantar", description: "Sopa leve com frango", calories: 340 },
    ],
    segunda: [
      { title: "Café da manhã", description: "Vitamina de banana + aveia", calories: 280 },
      { title: "Almoço", description: "Carne moída + purê de batata", calories: 540 },
      { title: "Café da tarde", description: "Castanhas + maçã", calories: 190 },
      { title: "Jantar", description: "Peixe grelhado + legumes", calories: 360 },
    ],
    terca: [
      { title: "Café da manhã", description: "Tapioca + café preto", calories: 310 },
      { title: "Almoço", description: "Arroz, feijão e frango", calories: 520 },
      { title: "Café da tarde", description: "Granola + iogurte", calories: 200 },
      { title: "Jantar", description: "Panqueca fit", calories: 350 },
    ],
    quarta: [
      { title: "Café da manhã", description: "Omelete + fruta", calories: 300 },
      { title: "Almoço", description: "Peixe assado + arroz", calories: 500 },
      { title: "Café da tarde", description: "Shake proteico", calories: 250 },
      { title: "Jantar", description: "Sanduíche natural", calories: 320 },
    ],
    quinta: [
      { title: "Café da manhã", description: "Pão integral + ovo", calories: 310 },
      { title: "Almoço", description: "Macarrão com frango", calories: 560 },
      { title: "Café da tarde", description: "Frutas + castanhas", calories: 170 },
      { title: "Jantar", description: "Salada completa", calories: 330 },
    ],
    sexta: [
      { title: "Café da manhã", description: "Crepioca proteica", calories: 320 },
      { title: "Almoço", description: "Frango desfiado + legumes", calories: 490 },
      { title: "Café da tarde", description: "Iogurte + mel", calories: 180 },
      { title: "Jantar", description: "Risoto fit", calories: 380 },
    ],
    sabado: [
      { title: "Café da manhã", description: "Panqueca de aveia", calories: 340 },
      { title: "Almoço", description: "Lasanha fit", calories: 530 },
      { title: "Café da tarde", description: "Suco natural + nuts", calories: 160 },
      { title: "Jantar", description: "Hambúrguer caseiro", calories: 400 },
    ],
  };
}
