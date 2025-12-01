// src/services/goals/calculateUserTargets.ts

export type QuizDataForTargets = {
  genero: string;
  objetivo: string;
  nivel_treino: string;
  frequencia_treino: string;
  peso_atual: number;
  altura: number;
  peso_desejado: number;
  refeicoes_dia: string;
  alergias: string[];
  alimentacao_atual: string;
};

export type UserTargets = {
  daily_calorie_goal: number;
  daily_protein_goal: number;
  daily_water_goal: number;
  daily_meals_goal: number;
  diet_type: string;
};

/** Fator de atividade baseado no nível do usuário */
function activityFactor(nivel: string, freq: string): number {
  if (nivel === "Iniciante") return 1.4;
  if (nivel === "Intermediário") return 1.55;
  if (nivel === "Avançado") return 1.7;

  // fallback básico
  return 1.5;
}

/** Classificação de dieta baseada em alergias e padrão alimentar */
function detectDietType(payload: QuizDataForTargets): string {
  const allergies = payload.alergias.map(a => a.toLowerCase());

  if (allergies.includes("lactose")) return "dairy_free";
  if (allergies.includes("glúten")) return "gluten_free";
  if (allergies.includes("nenhuma alergia/intolerância")) return "balanced";

  // alimentação muito ruim ou muito boa pode afetar estilo
  if (payload.alimentacao_atual === "Muito mal" || payload.alimentacao_atual === "Mal") {
    return "balanced_simple"; // dieta mais simples e fácil de seguir
  }

  return "balanced";
}

export function calculateUserTargets(payload: QuizDataForTargets): UserTargets {
  const peso = payload.peso_atual;
  const altura = payload.altura;
  const idade = 25; // opcional melhorar depois
  const genero = payload.genero.toLowerCase();

  // Fórmula Mifflin-St Jeor (mais usada atualmente)
  let TMB =
    genero === "masculino"
      ? 10 * peso + 6.25 * altura - 5 * idade + 5
      : 10 * peso + 6.25 * altura - 5 * idade - 161;

  const AF = activityFactor(payload.nivel_treino, payload.frequencia_treino);

  const TDEE = TMB * AF;

  // ajuste metas conforme objetivo
  let dailyCalories = TDEE;

  if (payload.objetivo === "Perder peso") {
    dailyCalories = TDEE - 350;
  } else if (payload.objetivo === "Ganhar massa muscular") {
    dailyCalories = TDEE + 300;
  }

  // proteína (meta simples)
  const dailyProtein = Math.round(peso * 1.8);

  // água (meta simples)
  const dailyWater = peso * 35; // ml

  const meals = Number(payload.refeicoes_dia.replace(/\D/g, "")) || 4;

  const dietType = detectDietType(payload);

  return {
    daily_calorie_goal: Math.round(dailyCalories),
    daily_protein_goal: dailyProtein,
    daily_water_goal: Math.round(dailyWater),
    daily_meals_goal: meals,
    diet_type: dietType,
  };
}
