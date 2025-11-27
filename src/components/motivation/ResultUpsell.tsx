// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import ProgressChart from "./ProgressChart";

// export default function ResultUpsell({
//   quizData,
//   onStartTrial,
//   onSeePlans,
// }: {
//   quizData: any;
//   onStartTrial: () => void;
//   onSeePlans: () => void;
// }) {
//   // exemplo de dados simulados para o gráfico
//   const sample = [
//     { label: "Semana 0", value: Number(quizData.peso_atual || 75) },
//     { label: "Semana 2", value: Number(quizData.peso_atual || 75) - 1.8 },
//     { label: "Semana 4", value: Number(quizData.peso_atual || 75) - 3.6 },
//     { label: "Semana 8", value: Number(quizData.peso_atual || 75) - 5.5 },
//     { label: "Semana 12", value: Number(quizData.peso_desejado || 65) },
//   ];

//   return (
//     <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 space-y-6">
//       <div className="flex items-center gap-4">
//         <div className="w-14 h-14 rounded-full bg-[#00C974] flex items-center justify-center text-white text-xl font-bold">✓</div>
//         <div>
//           <h2 className="text-2xl font-bold text-[#0A0A0A]">Plano 100% personalizado pronto</h2>
//           <p className="text-[#6F6F6F]">Criamos um plano único com base nas suas respostas — treinos, alimentação e rotina.</p>
//         </div>
//       </div>

//       <div>
//         <h3 className="font-semibold text-[#0A0A0A] mb-2">Como pode ficar seu progresso</h3>
//         <ProgressChart data={sample} height={180} />
//       </div>

//       <div className="space-y-3">
//         <p className="text-[#6F6F6F]">
//           Esse é um exemplo de projeção com um plano bem aplicado — você pode acelerar resultados com suporte completo e acompanhamento.
//         </p>

//         <div className="flex gap-3">
//           <Button onClick={onStartTrial} className="bg-[#FFB800] hover:bg-[#e6a200] text-white rounded-full">
//             Quero testar o plano personalizado
//           </Button>
//           <Button variant="outline" onClick={onSeePlans} className="rounded-full border-[#00C974] text-[#00C974]">
//             Ver planos e preços
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
