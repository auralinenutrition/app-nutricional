import CircularProgress from "./CircularProgess";

type DailyGoalsProps = {
  water: number;            // percentual
  meals: number;            // percentual
  calories: number;         // percentual
  mealsDone?: number;       // opcional, mas ideal
  mealsGoal?: number;       // opcional, mas ideal
  waterValue?: number;      // ml
  waterGoal?: number;       // ml
  caloriesValue?: number;   // kcal
  caloriesGoal?: number;    // kcal
};

export default function DailyGoals({
  water,
  meals,
  calories,
  mealsDone = 0,
  mealsGoal = 4,
  waterValue = 0,
  waterGoal = 2000,
  caloriesValue = 0,
  caloriesGoal = 2000
}: DailyGoalsProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
      <div className="grid grid-cols-3 gap-4 text-center">

        {/* ÁGUA */}
        <div>
          <CircularProgress
            value={water}
            innerText={`${waterValue}ml`}
            innerSub={`de ${waterGoal}`}
          />
          <p className="mt-2 font-medium">Água</p>
        </div>

        {/* REFEIÇÕES */}
        <div>
          <CircularProgress
            value={meals}
            innerText={`${mealsDone}/${mealsGoal}`}
            innerSub={`${meals}%`}
          />
          <p className="mt-2 font-medium">Refeições</p>
        </div>

        {/* CALORIAS */}
        <div>
          <CircularProgress
            value={calories}
            innerText={`${caloriesValue}`}
            innerSub={`kcal`}
          />
          <p className="mt-2 font-medium">Calorias</p>
        </div>

      </div>
    </div>
  );
}
