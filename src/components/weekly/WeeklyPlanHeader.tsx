export default function WeeklyPlanHeader() {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold text-[#0A0A0A]">
        Cardápio da semana
      </h1>
      <p className="text-gray-600 mt-1">
        Gerado pela IA com base no seu objetivo
      </p>

      <p className="text-sm text-gray-500 mt-2">
        Semana atual • Segunda → Domingo
      </p>
    </div>
  );
}
