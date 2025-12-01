"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";

export default function Motivacional4Page() {
  const params = useSearchParams();
  const router = useRouter();

  const fromStep = Number(params.get("from") ?? 21);
  const nextStep = params.get("next") ?? "/quiz/loading";

  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("quizData");
    if (saved) setQuizData(JSON.parse(saved));
  }, []);

  if (!quizData) return null;

  const pesoAtual = Number(quizData.peso_atual);
  const pesoDesejado = Number(quizData.peso_desejado);
  const delta = pesoDesejado - pesoAtual;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* HEADER */}
      <div className="pt-6 pb-4 px-6">
        <Button
          onClick={() => router.push(`/quiz?step=${fromStep}`)}
          variant="ghost"
          className="p-2"
        >
          <ChevronLeft className="w-5 h-5 text-[#0A0A0A]" />
        </Button>

        <div className="w-full h-2 bg-gray-200 rounded-full mt-3">
          <div
            className="h-full bg-[#00C974] rounded-full"
            style={{ width: "95%" }}
          />
        </div>
      </div>

      {/* CONTEÚDO */}
      <div className="px-6 flex-1">
        <h1 className="text-[26px] font-bold text-[#0A0A0A] leading-snug">
          Você está a poucos segundos
          <br />
          de desbloquear seu plano ideal
        </h1>

        <p className="mt-4 text-[#6F6F6F] text-sm leading-relaxed">
          Seus dados foram analisados e estamos prestes a gerar um plano 100%
          personalizado para acelerar sua evolução — feito exatamente para o seu
          corpo, sua rotina e seu objetivo.
        </p>

        {/* BLOCO DESTACADO */}
        <div className="mt-6 bg-[#F8F8F8] p-6 rounded-2xl shadow-sm border border-[#ECECEC]">
          <p className="text-sm text-[#0A0A0A] font-medium">
            Seu objetivo ({pesoAtual}kg → {pesoDesejado}kg)
          </p>

          <p className="mt-2 text-[13px] text-[#6F6F6F] leading-relaxed">
            Com base em perfis semelhantes ao seu, você tem um{" "}
            <b>alto potencial de atingir sua meta</b> seguindo as orientações
            certas.
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00C974] transition-all"
                style={{ width: `${Math.min(100, Math.abs(delta) * 5)}%` }}
              />
            </div>

            <span className="text-xs text-[#0A0A0A] font-semibold">
              {Math.abs(delta)}kg
            </span>
          </div>
        </div>

        <p className="text-[#0A0A0A] text-sm mt-6 leading-relaxed">
          Agora vamos gerar sua estratégia ideal de calorias, macros e hábitos —
          totalmente adaptada para você ter os melhores resultados possíveis.
        </p>
      </div>

      {/* CTA */}
      <div className="p-6">
        <Button
          onClick={() => router.push("/quiz/loading")}
          className="w-full h-12 rounded-full bg-[#00C974] hover:bg-[#00B368] text-white text-base font-semibold"
        >
          Criar meu plano personalizado →
        </Button>
      </div>
    </div>
  );
}
