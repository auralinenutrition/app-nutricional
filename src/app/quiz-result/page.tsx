"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import WeightProgressChart from "@/components/motivation/WeightProgressChart";

export default function QuizResultPage() {
  const router = useRouter();
  const [quizData, setQuizData] = useState<any>(null);

  // Carrega dados do quiz
  useEffect(() => {
    const saved = localStorage.getItem("quizData");
    if (saved) {
      setQuizData(JSON.parse(saved));
    }
  }, []);

  if (!quizData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Carregando...
      </div>
    );

  // Cálculos motivacionais
  const pesoAtual = Number(quizData.peso_atual);
  const pesoDesejado = Number(quizData.peso_desejado);
  const diferenca = pesoDesejado - pesoAtual;

  const tendencia = diferenca < 0 ? "perder" : "ganhar";
  const valorAbs = Math.abs(diferenca);

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-2xl mx-auto">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#0A0A0A]">
          Seu plano está pronto! 💪
        </h1>

        <p className="text-[#6F6F6F] text-lg">
          Criamos um plano 100% personalizado com base nas suas respostas.
        </p>
      </div>

      {/* BLOCO DO PESO */}
      <div className="mt-10 bg-[#F8F8F8] p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-[#0A0A0A] mb-4">
          Evolução projetada
        </h2>

        <div className="flex justify-around items-center py-4">
          <div className="text-center">
            <p className="text-sm text-[#6F6F6F]">Peso atual</p>
            <p className="text-3xl font-bold text-[#0A0A0A]">{pesoAtual}kg</p>
          </div>

          <div className="text-5xl">→</div>

          <div className="text-center">
            <p className="text-sm text-[#6F6F6F]">Peso ideal</p>
            <p className="text-3xl font-bold text-[#00C974]">
              {pesoDesejado}kg
            </p>
          </div>
        </div>

        <p className="text-center text-[#6F6F6F] text-sm mt-2">
          Você precisa {tendencia}{" "}
          <span className="font-semibold text-[#0A0A0A]">{valorAbs}kg</span>
          {diferenca === 0 && " — você já está no seu peso ideal!"}
        </p>
      </div>

      {/* GRÁFICO REAL */}
      <div
        className="w-full rounded-2xl p-6 mt-10"
      >
        <h2 className="text-center text-lg font-semibold mb-4 text-[#0A0A0A]">
          Seu progresso nas próximas semanas
        </h2>

        <WeightProgressChart objetivo={quizData.objetivo} />

        <p className="text-center text-sm text-[#3D3D3D] mt-4">
          Projeção baseada em milhares de usuários reais
        </p>
      </div>

      {/* MENSAGEM MOTIVACIONAL */}
      <div className="mt-10 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0A0A0A]">
          Seu objetivo é totalmente possível 🎯
        </h2>

        <p className="text-[#6F6F6F] leading-relaxed">
          Com consistência e o plano certo, você chega lá muito mais rápido do
          que imagina. Criamos recomendações feitas sob medida para sua rotina.
        </p>

        <ul className="text-left space-y-2 text-[#0A0A0A] font-medium mt-4 max-w-md mx-auto">
          <li>✔️ Plano alimentar personalizado</li>
          <li>✔️ Quantidade ideal de refeições por dia</li>
          <li>✔️ Adequado ao seu nível de disciplina</li>
          <li>✔️ Ajustado ao seu horário mais difícil</li>
          <li>✔️ Baseado em como você realmente vive</li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center space-y-4">
        <Button
          onClick={() => router.push("/planos")}
          className="w-full h-14 rounded-full bg-[#00C974] hover:bg-[#00B368] text-white text-lg"
        >
          Quero acessar meu plano agora
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
