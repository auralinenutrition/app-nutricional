type CaloriesCardProps = {
  calories: number;
};

export default function CaloriesCard({ calories } : CaloriesCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h3 className="font-semibold text-lg">Calorias</h3>
      <p className="text-2xl font-bold mt-2">{calories} kcal</p>
      <p className="text-gray-500 text-sm">Meta: 2000 kcal</p>
    </div>
  );
}
