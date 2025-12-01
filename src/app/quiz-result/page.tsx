"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import WeightProgressChart from "@/components/motivation/WeightProgressChart";
import { ArrowRight } from "lucide-react";

export default function QuizResultPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("quizData");
    if (saved) setQuizData(JSON.parse(saved));
  }, []);

  if (!quizData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );

  const pesoAtual = Number(quizData.peso_atual);
  const pesoDesejado = Number(quizData.peso_desejado);
  const diferenca = pesoDesejado - pesoAtual;
  const tendencia = diferenca < 0 ? "perder" : "ganhar";
  const valorAbs = Math.abs(diferenca);

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">

      {/* HEADER */}
      <div className="text-center space-y-3 mb-8">
        <h1 className="text-3xl font-extrabold text-[#0A0A0A]">
          Seu plano está pronto! 💪
        </h1>
        <p className="text-[#6F6F6F] text-base leading-relaxed">
          Criamos um plano totalmente personalizado para atingir seu objetivo **real**, 
          considerando seu peso, rotina, nível de disciplina e estilo de vida.
        </p>
      </div>

      {/* BLOCO DO PESO */}
      <div className="bg-[#F8F8F8] p-6 rounded-2xl shadow-sm mb-10">
        <h2 className="text-xl font-semibold text-[#0A0A0A] mb-6">
          Sua evolução projetada
        </h2>

        <div className="flex justify-around items-center">
          <div className="text-center">
            <p className="text-sm text-[#6F6F6F]">Peso atual</p>
            <p className="text-4xl font-bold">{pesoAtual}kg</p>
          </div>

          <div className="text-5xl text-gray-500">→</div>

          <div className="text-center">
            <p className="text-sm text-[#6F6F6F]">Peso desejado</p>
            <p className="text-4xl font-extrabold text-[#00C974]">
              {pesoDesejado}kg
            </p>
          </div>
        </div>

        <p className="text-center text-[#434343] text-sm mt-4">
          Você precisa <strong>{tendencia}</strong>{" "}
          <span className="font-semibold text-[#0A0A0A]">{valorAbs}kg</span>
        </p>
      </div>

      {/* GRÁFICO */}
      <div className="rounded-2xl p-6 border border-[#F0F0F0] bg-white">
        <h2 className="text-center text-lg font-semibold mb-4 text-[#0A0A0A]">
          Como será seu progresso nas próximas semanas
        </h2>

        <WeightProgressChart
          pesoAtual={pesoAtual}
          pesoDesejado={pesoDesejado}
        />

        <p className="text-center text-xs text-[#3D3D3D] mt-4 italic">
          *Projeção baseada em padrões reais de evolução de milhares de usuários.
        </p>
      </div>

      {/* BENEFÍCIOS */}
      <div className="mt-12 space-y-6 text-center">
        <h2 className="text-2xl font-bold text-[#0A0A0A]">
          Você está muito perto do seu novo corpo 🎯
        </h2>

        <p className="text-[#5A5A5A] leading-relaxed text-base">
          Preparamos um plano completo com refeições, metas diárias, lista de
          compras e organização — tudo para você ganhar consistência
          sem precisar pensar ou montar nada sozinho.
        </p>

        <ul className="text-left space-y-3 text-[#0A0A0A] font-medium bg-[#F7F7F7] p-5 rounded-2xl shadow-sm max-w-md mx-auto">
          <li>✔️ Metas alimentares personalizadas</li>
          <li>✔️ Refeições feitas para o seu objetivo</li>
          <li>✔️ Lista de compras automática</li>
          <li>✔️ Estratégias para sua disciplina atual</li>
          <li>✔️ Plano adaptado à sua rotina real</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12 space-y-5">
        <Button
          onClick={() => router.push("/planos")}
          className="w-full h-16 rounded-full bg-[#00C974] hover:bg-[#00B368] text-white text-xl font-semibold flex items-center justify-center gap-2"
        >
          Acessar meu plano completo
          <ArrowRight className="w-5 h-5" />
        </Button>

        <button
          onClick={() => router.push("/")}
          className="text-[#6F6F6F] underline text-sm"
        >
          Refazer quiz
        </button>
      </div>
    </div>
  );
}
