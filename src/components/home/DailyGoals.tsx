import CircularProgress from "./CircularProgess";

type DailyGoalsProps = {
  water: number;
  meals: number;
  calories: number;
};

export default function DailyGoals({ water, meals, calories } : DailyGoalsProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
      <div className="grid grid-cols-3 gap-4 text-center">

        <div>
          <CircularProgress value={water} />
          <p className="mt-2 font-medium">Água</p>
          <p className="text-sm text-gray-500">{water}%</p>
        </div>

        <div>
          <CircularProgress value={meals} />
          <p className="mt-2 font-medium">Refeições</p>
          <p className="text-sm text-gray-500">{meals}%</p>
        </div>

        <div>
          <CircularProgress value={calories} />
          <p className="mt-2 font-medium">Calorias</p>
          <p className="text-sm text-gray-500">{calories}%</p>
        </div>

      </div>
    </div>
  );
}
