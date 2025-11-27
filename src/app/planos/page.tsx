"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

export default function PlanosPage() {
  const router = useRouter();

  const selecionarPlano = (plano: string) => {
    localStorage.setItem("planoSelecionado", plano);

    if (plano === "free") {
      router.push("/signup");
    } else {
      router.push(`/checkout?plano=${plano}`);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-[#0A0A0A]">
        Escolha seu plano
      </h1>

      <p className="text-center text-[#6F6F6F] mt-2">
        Opções flexíveis para sua rotina
      </p>

      <div className="mt-10 space-y-6">
        {/* ========================== */}
        {/* PLANO GRATUITO */}
        {/* ========================== */}
        <div
          className="border-2 border-[#00C974] rounded-2xl p-6 shadow-sm bg-white cursor-pointer transition hover:shadow-md"
          onClick={() => selecionarPlano("free")}
        >
          <h2 className="text-xl font-bold text-[#0A0A0A]">Plano Gratuito</h2>

          <ul className="text-[#6F6F6F] mt-3 space-y-1 text-sm">
            <li>• Registrar até 2 refeições</li>
            <li>• 1 rotina básica</li>
            <li>• Gráfico simples</li>
            <li>• 1 lembrete diário</li>
          </ul>

          <Button
            onClick={() => selecionarPlano("free")}
            className="w-full mt-4 rounded-full bg-[#00C974] text-white hover:bg-[#00B368]"
          >
            Continuar grátis
          </Button>
        </div>

        {/* ========================== */}
        {/* PREMIUM */}
        {/* ========================== */}
        <div
          className="border-2 border-[#00C974] rounded-2xl p-6 shadow-md bg-white cursor-pointer relative transition hover:shadow-lg"
          onClick={() => selecionarPlano("premium")}
        >
          <div className="absolute top-[-12px] right-4 bg-[#00C974] text-white text-xs px-3 py-1 rounded-full shadow">
            Mais usado
          </div>

          <h2 className="text-xl font-bold text-[#0A0A0A]">Premium</h2>
          <p className="text-2xl font-bold text-[#00C974] mt-1">
            R$ 19,90/mês{" "}
            <span className="text-sm text-[#6F6F6F]">ou R$ 99/ano</span>
          </p>

          <ul className="text-[#6F6F6F] mt-3 space-y-1 text-sm">
            <li>• Refeições ilimitadas</li>
            <li>• Todas as rotinas completas</li>
            <li>• Fotos ilimitadas</li>
            <li>• Gráficos avançados</li>
            <li>• Lembretes ilimitados</li>
            <li>• Resumo semanal</li>
            <li>• Badges</li>
            <li>• Motivação inteligente</li>
          </ul>

          <Button
            onClick={() => selecionarPlano("premium")}
            className="w-full mt-4 rounded-full bg-[#00C974] text-white hover:bg-[#00B368]"
          >
            Assinar Premium
          </Button>
        </div>

        {/* ========================== */}
        {/* VITALÍCIO */}
        {/* ========================== */}
        <div
          className="border-2 border-yellow-500 rounded-2xl p-6 shadow-lg bg-gradient-to-b from-yellow-50 to-white cursor-pointer transition hover:shadow-xl"
          onClick={() => selecionarPlano("vitalicio")}
        >
          <div className="flex items-center gap-2">
            <Crown className="text-yellow-600" size={22} />
            <h2 className="text-xl font-bold text-[#0A0A0A]">Vitalício</h2>
          </div>

          <p className="text-2xl font-bold text-yellow-600 mt-1">R$ 120</p>
          <p className="text-[#6F6F6F] text-sm">Pagamento único</p>

          <ul className="text-[#6F6F6F] mt-3 space-y-1 text-sm">
            <li>• Tudo do Premium</li>
            <li>• Acesso vitalício</li>
            <li>• Temas exclusivos</li>
            <li>• Diário pessoal</li>
            <li>• Rotinas avançadas</li>
            <li>• Receitas</li>
            <li>• Badge VIP</li>
            <li>• Acesso antecipado a funções</li>
          </ul>

          <Button
            onClick={() => selecionarPlano("vitalicio")}
            className="w-full mt-4 rounded-full bg-yellow-500 text-white hover:bg-yellow-600"
          >
            Acessar Vitalício
          </Button>
        </div>
      </div>
    </div>
  );
}
