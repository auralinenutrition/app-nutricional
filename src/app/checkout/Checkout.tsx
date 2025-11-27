"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const params = useSearchParams();
  const plano = params.get("plano"); // "premium" ou "vitalicio"

  const isPremium = plano === "premium";
  const isVitalicio = plano === "vitalicio";

  return (
    <div className="min-h-screen bg-white px-6 py-10 max-w-xl mx-auto">

      <h1 className="text-3xl font-bold text-[#0A0A0A] text-center mb-6">
        Finalizar Assinatura
      </h1>

      <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 space-y-4">
        
        <h2 className="text-2xl font-semibold text-[#0A0A0A]">
          {isPremium && "Plano Premium"}
          {isVitalicio && "Plano Vitalício"}
        </h2>

        <p className="text-gray-600">Acesso completo ao aplicativo:</p>

        <ul className="space-y-2 text-[#0A0A0A]">
          <li className="flex items-center gap-2"><Check className="text-green-500" /> Refeições ilimitadas</li>
          <li className="flex items-center gap-2"><Check className="text-green-500" /> Rotinas completas</li>
          <li className="flex items-center gap-2"><Check className="text-green-500" /> Fotos ilimitadas</li>
          <li className="flex items-center gap-2"><Check className="text-green-500" /> Gráficos avançados</li>
          <li className="flex items-center gap-2"><Check className="text-green-500" /> Motivação inteligente</li>
          {isVitalicio && (
            <>
              <li className="flex items-center gap-2"><Check className="text-yellow-500" /> Acesso vitalício</li>
              <li className="flex items-center gap-2"><Check className="text-yellow-500" /> Badge VIP</li>
            </>
          )}
        </ul>

        <div className="text-center pt-4">
          {isPremium && (
            <>
              <p className="text-3xl font-bold text-[#00C974]">R$ 19,90/mês</p>
              <p className="text-gray-500">ou R$ 99/ano</p>
            </>
          )}

          {isVitalicio && (
            <p className="text-3xl font-bold text-yellow-600">R$ 120</p>
          )}
        </div>

        <Button
          onClick={() => router.push("/home")}
          className="w-full h-14 rounded-full bg-[#00C974] hover:bg-[#00B368] text-white text-lg"
        >
          Confirmar Pagamento
        </Button>

      </div>
    </div>
  );
}
