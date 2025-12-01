import { supabase } from "@/lib/supabase";
import { calculateUserTargets } from "../goals/calculateUserTargets";
import { saveUserTargets } from "../goals/saveUserTargets";
import quizService from "./quizService";

export async function finishQuizAfterSignup(userId: string) {
  const raw = localStorage.getItem("quizData");
  if (!raw) return;

  const quizData = JSON.parse(raw);

  const payload = {
    ...quizData,
    peso_atual: Number(quizData.peso_atual),
    peso_desejado: Number(quizData.peso_desejado),
    altura: Number(quizData.altura),
  };

  // 1) Salvar quiz responses
  await quizService.saveQuizResponses(userId, payload);

  // 2) Atualizar tabela users
  await supabase
    .from("users")
    .update({
      peso_atual: payload.peso_atual,
      peso_inicial: payload.peso_atual,
      peso_desejado: payload.peso_desejado,
      altura: payload.altura,
      objetivo: payload.objetivo,
      nivel_treino: payload.nivel_treino,
      frequencia_semanal: payload.frequencia_treino,
    })
    .eq("id", userId);

  // 3) Calcular e salvar metas
  const targets = calculateUserTargets(payload);
  await saveUserTargets(userId, targets);
}
