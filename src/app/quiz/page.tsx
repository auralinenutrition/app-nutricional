"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft } from "lucide-react";

import ScrollWheelPicker from "@/components/scrollWhellPicker/ScrollWhellPicker";
import ScrollWheelPickerDate from "@/components/scrollWhellPicker/ScrollWheelDatePicker";
import MotivationalModal from "@/components/motivation/MotivationModel";

import { useAuth } from "@/contexts/AuthContext";
import quizService from "@/services/quizService";

// ======================================
// TIPAGEM DO QUIZ
// ======================================
type QuizData = {
  objetivo: string;
  nivel_treino: string;
  frequencia_treino: string;
  peso_atual: string;
  altura: string;
  peso_desejado: string;
  dia_nascimento: string;
  mes_nascimento: string;
  ano_nascimento: string;
  horario_treino: string;
  alimentacao_atual: string;
  refeicoes_dia: string;
  rotina_trabalho: string[];
  nivel_disciplina: string;
  dificuldade_principal: string[];
  horario_dificil: string;
  agua: string;
  sono: string;
  tentou_dieta: string;
  expectativa: string;
  prazo_resultado: string;
  alergias: string[];
  outras_alergias: string;
};

export default function QuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const totalSteps = 22;

  const [step, setStep] = useState(1);

  const [quizData, setQuizData] = useState<QuizData>({
    objetivo: "",
    nivel_treino: "",
    frequencia_treino: "",
    peso_atual: "",
    altura: "",
    peso_desejado: "",
    dia_nascimento: "",
    mes_nascimento: "",
    ano_nascimento: "",
    horario_treino: "",
    alimentacao_atual: "",
    refeicoes_dia: "",
    rotina_trabalho: [],
    nivel_disciplina: "",
    dificuldade_principal: [],
    horario_dificil: "",
    agua: "",
    sono: "",
    tentou_dieta: "",
    expectativa: "",
    prazo_resultado: "",
    alergias: [],
    outras_alergias: "",
  });

  const [pesoAtual, setPesoAtual] = useState(70);
  const [altura, setAltura] = useState(170);
  const [pesoDesejado, setPesoDesejado] = useState(65);

  const [dia, setDia] = useState(1);
  const [mes, setMes] = useState("Janeiro");
  const [ano, setAno] = useState(2000);

  const gerarArrayPeso = () => Array.from({ length: 171 }, (_, i) => 30 + i);
  const gerarArrayAltura = () => Array.from({ length: 121 }, (_, i) => 100 + i);

  const dias = Array.from({ length: 31 }, (_, i) => i + 1);
  const meses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const anos = Array.from({ length: 100 }, (_, i) => 2024 - i);

  const [showMetaModal, setShowMetaModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showAlmostThereModal, setShowAlmostThereModal] = useState(false);

  const handleNext = () => {
    if (step === 4) setQuizData({ ...quizData, peso_atual: `${pesoAtual}` });
    if (step === 5) setQuizData({ ...quizData, altura: `${altura}` });

    if (step === 6) {
      setQuizData({ ...quizData, peso_desejado: `${pesoDesejado}` });
      setShowMetaModal(true);
      return;
    }

    if (step === 7) {
      setQuizData({
        ...quizData,
        dia_nascimento: `${dia}`,
        mes_nascimento: mes,
        ano_nascimento: `${ano}`,
      });
    }

    if (step === 11) {
      setShowProgressModal(true);
      return;
    }

    if (step === totalSteps - 1) {
      setShowAlmostThereModal(true);
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
      return;
    }

    localStorage.setItem("quiz_completed", "true");
    localStorage.setItem("quizData", JSON.stringify(quizData));
    router.push("/quiz-result");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else router.push("/");
  };

  const progress = (step / totalSteps) * 100;

  const renderQuestion = () => {
    switch (step) {
      // ------------------------
      // STEP 1 — OBJETIVO
      // ------------------------
      case 1:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold text-[#0A0A0A]">
              Qual é seu objetivo principal?
            </h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {[
                "Perder peso",
                "Ganhar massa muscular",
                "Manter peso",
                "Melhorar hábitos",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setQuizData({ ...quizData, objetivo: opt })}
                  className={`w-full h-14 px-6 flex items-center justify-between rounded-xl border-2 transition ${
                    quizData.objetivo === opt
                      ? "border-[#00C974] bg-white"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 2 — NÍVEL DE TREINO
      // ------------------------
      case 2:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Qual é o seu nível de treino?
            </h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {["Iniciante", "Intermediário", "Avançado"].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setQuizData({ ...quizData, nivel_treino: opt })
                  }
                  className={`w-full h-14 px-6 rounded-xl border-2 ${
                    quizData.nivel_treino === opt
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 3 — FREQUÊNCIA DE TREINO
      // ------------------------
      case 3:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Quantas vezes você treina por semana?
            </h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {[
                "Não treino",
                "1–2x por semana",
                "3–4x por semana",
                "5–6x por semana",
                "Todos os dias",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setQuizData({ ...quizData, frequencia_treino: opt })
                  }
                  className={`w-full h-14 px-6 rounded-xl border-2 ${
                    quizData.frequencia_treino === opt
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 4 — PESO ATUAL
      // ------------------------
      case 4:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">Qual é o seu peso atual?</h2>
            <p className="text-[#6F6F6F]">Ajuste usando o seletor abaixo</p>

            <ScrollWheelPicker
              value={pesoAtual}
              onChange={(v) => setPesoAtual(Number(v))}
              options={gerarArrayPeso()}
              unit="kg"
            />

            <p className="text-4xl text-center font-semibold">{pesoAtual} kg</p>
          </div>
        );

      // ------------------------
      // STEP 5 — ALTURA
      // ------------------------
      case 5:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">Qual é a sua altura?</h2>
            <p className="text-[#6F6F6F]">Ajuste usando o seletor abaixo</p>

            <ScrollWheelPicker
              value={altura}
              onChange={(v) => setAltura(Number(v))}
              options={gerarArrayAltura()}
              unit="cm"
            />

            <p className="text-4xl text-center font-semibold">{altura} cm</p>
          </div>
        );

      // ------------------------
      // STEP 6 — PESO DESEJADO
      // ------------------------
      case 6:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Qual peso você deseja atingir?
            </h2>
            <p className="text-[#6F6F6F]">Ajuste usando o seletor abaixo</p>

            <ScrollWheelPicker
              value={pesoDesejado}
              onChange={(v) => setPesoDesejado(Number(v))}
              options={gerarArrayPeso()}
              unit="kg"
            />

            <div className="text-center">
              <p className="text-4xl font-semibold">{pesoDesejado} kg</p>
              <p className="mt-2 text-red-500">
                {pesoDesejado - pesoAtual >= 0 ? "+" : ""}
                {pesoDesejado - pesoAtual} kg
              </p>
            </div>
          </div>
        );

      // ------------------------
      // STEP 7 — DATA DE NASCIMENTO
      // ------------------------
      case 7:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">Quando você nasceu?</h2>
            <p className="text-[#6F6F6F]">
              Isso será usado para calibrar seu plano personalizado
            </p>

            <div className="flex justify-center gap-8">
              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm text-[#6F6F6F] font-bold">
                  Dia
                </span>
                <ScrollWheelPickerDate
                  value={dia}
                  onChange={(v) => setDia(Number(v))}
                  options={dias}
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm text-[#6F6F6F] font-bold">
                  Mês
                </span>
                <ScrollWheelPickerDate
                  value={mes}
                  onChange={(v) => setMes(String(v))}
                  options={meses}
                />
              </div>

              <div className="flex flex-col items-center">
                <span className="mb-2 text-sm text-[#6F6F6F] font-bold">
                  Ano
                </span>
                <ScrollWheelPickerDate
                  value={ano}
                  onChange={(v) => setAno(Number(v))}
                  options={anos}
                />
              </div>
            </div>
          </div>
        );

      // ------------------------
      // STEP 8 — HORÁRIO TREINO
      // ------------------------
      case 8:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">Quando você treina?</h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {["Manhã", "Tarde", "Noite", "Varia muito", "Não treino"].map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setQuizData({ ...quizData, horario_treino: opt })
                    }
                    className={`w-full h-14 rounded-xl border-2 ${
                      quizData.horario_treino === opt
                        ? "border-[#00C974]"
                        : "border-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>
        );

      // ------------------------
      // STEP 9 — ALIMENTAÇÃO
      // ------------------------
      case 9:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Como você se alimenta atualmente?
            </h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {["Muito mal", "Mal", "Mediana", "Boa", "Muito boa"].map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setQuizData({ ...quizData, alimentacao_atual: opt })
                    }
                    className={`w-full h-14 rounded-xl border-2 ${
                      quizData.alimentacao_atual === opt
                        ? "border-[#00C974]"
                        : "border-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>
        );

      // ------------------------
      // STEP 10 — REFEIÇÕES DIA
      // ------------------------
      case 10:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Quantas refeições faz por dia?
            </h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {["2", "3", "4", "5 ou mais"].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setQuizData({ ...quizData, refeicoes_dia: opt })
                  }
                  className={`w-full h-14 rounded-xl border-2 ${
                    quizData.refeicoes_dia === opt
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 11 — ROTINA
      // ------------------------
      case 11:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Como é sua rotina de trabalho/estudo?
            </h2>
            <p className="text-[#6F6F6F]">Pode escolher mais de uma opção</p>

            <div className="space-y-3">
              {[
                "Sentado o dia todo",
                "Em pé o dia todo",
                "Muito movimento",
                "Trabalha/estuda e não cozinha",
                "Rotina corrida",
                "Bastante tempo livre",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    const exists = quizData.rotina_trabalho.includes(opt);
                    const updated = exists
                      ? quizData.rotina_trabalho.filter((o) => o !== opt)
                      : [...quizData.rotina_trabalho, opt];

                    setQuizData({ ...quizData, rotina_trabalho: updated });
                  }}
                  className={`w-full h-14 rounded-xl border-2 ${
                    quizData.rotina_trabalho.includes(opt)
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 12 — DISCIPLINA
      // ------------------------
      case 12:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">Nível de disciplina atual</h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {["Muito baixa", "Baixa", "Média", "Alta", "Muito alta"].map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setQuizData({ ...quizData, nivel_disciplina: opt })
                    }
                    className={`w-full h-14 rounded-xl border-2 ${
                      quizData.nivel_disciplina === opt
                        ? "border-[#00C974]"
                        : "border-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>
        );

      // ------------------------
      // STEP 13 — DIFICULDADE PRINCIPAL
      // ------------------------
      case 13:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">Dificuldade principal</h2>
            <p className="text-[#6F6F6F]">Pode escolher mais de uma</p>

            <div className="space-y-3">
              {[
                "Falta de disciplina",
                "Falta de organização",
                "Não sei o que comer",
                "Esqueço de registrar",
                "Falta de tempo",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    const exists = quizData.dificuldade_principal.includes(opt);
                    const updated = exists
                      ? quizData.dificuldade_principal.filter((o) => o !== opt)
                      : [...quizData.dificuldade_principal, opt];

                    setQuizData({
                      ...quizData,
                      dificuldade_principal: updated,
                    });
                  }}
                  className={`w-full h-14 rounded-xl border-2 ${
                    quizData.dificuldade_principal.includes(opt)
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 14 — HORÁRIO DIFÍCIL
      // ------------------------
      case 14:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Qual é o seu horário mais difícil do dia?
            </h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {["Manhã", "Tarde", "Noite", "Madrugada"].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setQuizData({ ...quizData, horario_dificil: opt })
                  }
                  className={`w-full h-14 rounded-xl border-2 ${
                    quizData.horario_dificil === opt
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 15 — ÁGUA
      // ------------------------
      case 15:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">Bebe água regularmente?</h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {[
                "Quase nada",
                "Pouco",
                "Moderado",
                "Muito",
                "Bebo o suficiente",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setQuizData({ ...quizData, agua: opt })}
                  className={`w-full h-14 rounded-xl border-2 ${
                    quizData.agua === opt
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 16 — SONO
      // ------------------------
      case 16:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">Como está seu sono?</h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {["Muito ruim", "Ruim", "Normal", "Bom", "Excelente"].map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() => setQuizData({ ...quizData, sono: opt })}
                    className={`w-full h-14 rounded-xl border-2 ${
                      quizData.sono === opt
                        ? "border-[#00C974]"
                        : "border-gray-200"
                    }`}
                  >
                    {opt}
                  </button>
                )
              )}
            </div>
          </div>
        );

      // ------------------------
      // STEP 17 — TENTOU DIETA
      // ------------------------
      case 17:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Já tentou seguir dieta antes?
            </h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {[
                "Sim, muitas vezes",
                "Algumas vezes",
                "Poucas vezes",
                "Nunca",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setQuizData({ ...quizData, tentou_dieta: opt })
                  }
                  className={`w-full h-14 rounded-xl border-2 ${
                    quizData.tentou_dieta === opt
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 18 — EXPECTATIVA
      // ------------------------
      case 18:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">O que você espera do app?</h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {[
                "Organização",
                "Motivação",
                "Simplicidade",
                "Acompanhamento",
                "Tudo acima",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setQuizData({ ...quizData, expectativa: opt })}
                  className={`w-full h-14 rounded-xl border-2 ${
                    quizData.expectativa === opt
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 19 — PRAZO
      // ------------------------
      case 19:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Em quanto tempo quer ver resultados?
            </h2>
            <p className="text-[#6F6F6F]">Escolha uma opção</p>

            <div className="space-y-3">
              {[
                "2 semanas",
                "1 mês",
                "2 meses",
                "3 meses",
                "Sem prazo definido",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() =>
                    setQuizData({ ...quizData, prazo_resultado: opt })
                  }
                  className={`w-full h-14 rounded-xl border-2 ${
                    quizData.prazo_resultado === opt
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      // ------------------------
      // STEP 20 — ALERGIAS
      // ------------------------
      case 20:
        return (
          <div className="space-y-10">
            <h2 className="text-2xl font-bold">
              Você possui alguma alergia ou intolerância?
            </h2>
            <p className="text-[#6F6F6F]">
              Selecione quantas forem necessárias
            </p>

            <div className="space-y-3">
              {[
                "Glúten",
                "Lactose",
                "Frutos do mar",
                "Ovos",
                "Amendoim",
                "Corantes/conservantes",
                "Nenhuma alergia/intolerância",
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    const exists = quizData.alergias.includes(opt);
                    const updated = exists
                      ? quizData.alergias.filter((o) => o !== opt)
                      : [...quizData.alergias, opt];

                    setQuizData({ ...quizData, alergias: updated });
                  }}
                  className={`w-full h-14 rounded-xl border-2 ${
                    quizData.alergias.includes(opt)
                      ? "border-[#00C974]"
                      : "border-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}

              <Input
                placeholder="Outras alergias..."
                value={quizData.outras_alergias}
                onChange={(e) =>
                  setQuizData({
                    ...quizData,
                    outras_alergias: e.target.value,
                  })
                }
                className="w-full h-14 px-4 rounded-xl border-2 border-gray-200"
              />
            </div>
          </div>
        );
      // ------------------------
      // STEP 22 — FINAL
      // ------------------------
      case 21:
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Tudo pronto!</h2>
            <p className="text-[#6F6F6F]">Clique em finalizar para avançar.</p>
            <div className="text-6xl">🎉</div>
          </div>
        );

      default:
        return <h2>Passo {step} não configurado.</h2>;
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <Button onClick={handleBack} variant="ghost" className="p-2">
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <span className="text-sm text-gray-600">
              {step} de {totalSteps}
            </span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
            <div
              className="h-full bg-[#00C974] rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {renderQuestion()}

        {/* Gatilho 1 */}
        <MotivationalModal
          open={showMetaModal}
          title="🎯 Sua meta é totalmente possível!"
          subtitle="Com consistência e o plano certo, você chega lá."
          primaryLabel="Ver projeção"
          onPrimary={() => {
            setShowMetaModal(false);
            setTimeout(() => setStep(step + 1), 150);
          }}
          onClose={() => setShowMetaModal(false)}
        />

        {/* Gatilho 2 */}
        <MotivationalModal
          open={showProgressModal}
          title="📉 Olha sua evolução!"
          subtitle="Pequenos passos somam grandes resultados."
          primaryLabel="Continuar"
          onPrimary={() => {
            setShowProgressModal(false);
            setStep(step + 1);
          }}
          onClose={() => setShowProgressModal(false)}
        />

        {/* Gatilho 3 */}
        <MotivationalModal
          open={showAlmostThereModal}
          title="💪 Você está MUITO perto!"
          subtitle="Continue para ver seu plano totalmente personalizado."
          primaryLabel="Ver meu plano"
          onPrimary={() => {
            setShowAlmostThereModal(false);
            localStorage.setItem("quizData", JSON.stringify(quizData));
            localStorage.setItem("quiz_completed", "true");
            router.push("/quiz-result");
          }}
          onClose={() => setShowAlmostThereModal(false)}
        />

        {/* BOTÃO FINAL */}
        <Button
          onClick={handleNext}
          className="w-full h-14 mt-10 rounded-full bg-[#00C974] hover:bg-[#00B368] text-white text-lg"
        >
          {step === totalSteps ? "Finalizar" : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
