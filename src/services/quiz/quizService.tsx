// /services/quizService.ts
"use client";

import { supabase } from "@/lib/supabase";

/**
 * Tipagem do payload do quiz (resumida a partir do seu prompt mestre).
 * Adapte se você tiver nomes diferentes.
 */
export type QuizPayload = {
  objetivo: string;
  nivel_treino: string;
  frequencia_treino: string;
  horario_treino: string;
  alimentacao_atual: string;
  refeicoes_dia: string;
  rotina_trabalho: string[]; // multiple choice
  nivel_disciplina: string;
  dificuldade_principal: string[]; // multiple choice
  horario_dificil: string;
  agua: string;
  sono: string;
  tentou_dieta: string;
  expectativa: string;
  prazo_resultado: string;
  peso_atual: number;
  altura: number;
  peso_desejado: number;
  alergias: string[]; // multiple
};

/**
 * Resultado padrão das funções (sucesso / erro).
 */
type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Salva as respostas do quiz na tabela `quiz_responses`.
 * - userId: id do usuário (string)
 * - payload: respostas do quiz
 */
export async function saveQuizResponses(
  userId: string,
  payload: QuizPayload
): Promise<ServiceResult<any>> {
  try {
    const toInsert = {
      user_id: userId,
      objetivo: payload.objetivo,
      nivel_treino: payload.nivel_treino,
      frequencia_treino: payload.frequencia_treino,
      horario_treino: payload.horario_treino,
      alimentacao_atual: payload.alimentacao_atual,
      refeicoes_dia: payload.refeicoes_dia,
      rotina_trabalho: payload.rotina_trabalho,
      nivel_disciplina: payload.nivel_disciplina,
      dificuldade_principal: payload.dificuldade_principal,
      horario_dificil: payload.horario_dificil,
      agua: payload.agua,
      sono: payload.sono,
      tentou_dieta: payload.tentou_dieta,
      expectativa: payload.expectativa,
      prazo_resultado: payload.prazo_resultado,
      peso_atual: payload.peso_atual,
      altura: payload.altura,
      peso_desejado: payload.peso_desejado,
      alergias: payload.alergias,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("quiz_responses")
      .insert([toInsert])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro desconhecido" };
  }
}

/**
 * Atualiza a tabela `users` com os campos principais vindos do quiz.
 * - userId: id do usuário
 * - payload: subset de campos do quiz (peso/altura/objetivo/nivel/frequencia)
 */
export async function updateUserFromQuiz(
  userId: string,
  payload: Partial<QuizPayload>
): Promise<ServiceResult<any>> {
  try {
    const updateObj: Record<string, any> = {};

    if (typeof payload.peso_atual === "number")
      updateObj.peso_atual = payload.peso_atual;
    if (typeof payload.peso_desejado === "number")
      updateObj.peso_desejado = payload.peso_desejado;
    if (typeof payload.peso_atual === "number")
      updateObj.peso_inicial = payload.peso_atual; // definir peso_inicial no primeiro quiz
    if (typeof payload.altura === "number") updateObj.altura = payload.altura;
    if (payload.objetivo) updateObj.objetivo = payload.objetivo;
    if (payload.nivel_treino) updateObj.nivel_treino = payload.nivel_treino;
    if (payload.frequencia_treino)
      updateObj.frequencia_semanal = payload.frequencia_treino;

    // Se não houver nada a atualizar:
    if (Object.keys(updateObj).length === 0) {
      return { success: false, error: "Nenhum campo para atualizar" };
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateObj)
      .eq("id", userId)
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || "Erro desconhecido" };
  }
}

/**
 * Gera uma projeção linear de peso ao longo de N semanas.
 * - pesoAtual: número
 * - pesoDesejado: número
 * - weeks: número de semanas (padrão 12)
 *
 * Retorna um array de objetos: [{ week: 0, weight: 80 }, { week: 1, weight: 79.2 }, ...]
 *
 * Observação: isso é uma projeção linear simples. Ajuste a lógica conforme desejar.
 */
export function calculateWeightProjection(
  pesoAtual: number,
  pesoDesejado: number,
  weeks = 12
): { week: number; weight: number }[] {
  // Evita divisão por zero
  const w = Math.max(1, Math.floor(weeks));
  const diff = pesoDesejado - pesoAtual;
  const step = diff / w;

  const arr: { week: number; weight: number }[] = [];
  for (let i = 0; i <= w; i++) {
    const weight = +(pesoAtual + step * i).toFixed(1); // 1 casa decimal
    arr.push({ week: i, weight });
  }
  return arr;
}

/**
 * Gera benefícios motivacionais simples com base nas respostas do quiz.
 * Pode ser usado para preencher a tela de resultado enquanto integraremos OpenAI.
 */
export function generateMotivationalBenefits(payload: QuizPayload): string[] {
  const benefits: string[] = [];

  // objetivo
  if (/emagrec|perder/i.test(payload.objetivo)) {
    benefits.push(
      "Plano focado em queima de gordura com metas semanais realistas."
    );
  } else if (/massa|ganhar/i.test(payload.objetivo)) {
    benefits.push(
      "Plano orientado para ganho de massa com equilíbrio calórico e proteína."
    );
  } else {
    benefits.push(
      "Plano personalizado para manutenção e hábitos consistentes."
    );
  }

  // nível de treino
  if (/iniciante|beginner/i.test(payload.nivel_treino)) {
    benefits.push(
      "Treinos iniciais fáceis de seguir — ideal para começar sem lesões."
    );
  } else if (/intermedi|médio/i.test(payload.nivel_treino)) {
    benefits.push("Treinos moderados para acelerar progresso com segurança.");
  } else {
    benefits.push("Treinos avançados para quem busca evolução consistente.");
  }

  // água / sono
  if (Number(payload.agua) < 6 || /pouco/i.test(payload.agua)) {
    benefits.push("Dicas práticas para aumentar sua hidratação diária.");
  }
  if (Number(payload.sono) < 7 || /pouco/i.test(payload.sono)) {
    benefits.push(
      "Estratégias para melhorar a qualidade do sono e recuperação."
    );
  }

  // dificuldades / disciplina
  if (payload.dificuldade_principal?.length) {
    benefits.push(
      `Soluções rápidas para ${payload.dificuldade_principal
        .slice(0, 2)
        .join(", ")}.`
    );
  }

  // expectativa / prazo
  if (/rápido|30 dias|um mês|1 mês/i.test(payload.prazo_resultado)) {
    benefits.push(
      "Metas realistas: pequenas vitórias semanais são mais sustentáveis."
    );
  }

  // fallback
  if (benefits.length === 0) {
    benefits.push(
      "Plano personalizado e progressivo para te ajudar diariamente."
    );
  }

  return benefits;
}

/**
 * EXEMPLO DE USO (pseudo-code)
 *
 * // 1) Salvar quiz responses
 * const res = await saveQuizResponses(userId, quizPayload);
 * if (!res.success) console.error(res.error);
 *
 * // 2) Atualizar user
 * const up = await updateUserFromQuiz(userId, quizPayload);
 * if (!up.success) console.error(up.error);
 *
 * // 3) Gerar projeção
 * const proj = calculateWeightProjection(quizPayload.peso_atual, quizPayload.peso_desejado, 12);
 *
 * // 4) Gerar benefícios
 * const benefits = generateMotivationalBenefits(quizPayload);
 *
 * // Use proj + benefits para popular a tela de resultado.
 */

export default {
  saveQuizResponses,
  updateUserFromQuiz,
  calculateWeightProjection,
  generateMotivationalBenefits,
};
