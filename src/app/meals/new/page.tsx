"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import loadTodayMeals from "@/services/home/loadTodayMeals";
import { supabase } from "@/lib/supabase";
import mealService from "@/services/home/mealService";

const mealOptions = [
  "Café da manhã",
  "Almoço",
  "Café da tarde",
  "Jantar",
];

export default function NewMealPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const [mealType, setMealType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [calories, setCalories] = useState<number | "">("");

  const [loading, setLoading] = useState(false);

  // pegar usuário
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // quando usuário escolher "almoço", "café da manhã", etc → carregamos sugestão da IA
  useEffect(() => {
    if (!mealType || !user) return;

    async function loadSuggestion() {
      const today = await loadTodayMeals(user.id);

      const selected = today.find((m) => m.title === mealType);

      if (selected) {
        setDescription(selected.description ?? "");
        setCalories(selected.calories ?? "");
      }
    }

    loadSuggestion();
  }, [mealType, user]);

  async function handleSave() {
    if (!user) return;
    if (!mealType || !description) return;

    setLoading(true);
    const result = await mealService.addMeal(user.id, {
      title: mealType,
      description,
      calories: Number(calories),
    });
    setLoading(false);

    if (result.success) {
      router.push("/home"); // ou simplesmente router.back()
    } else {
      alert("Erro: " + result.error);
    }
  }

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Registrar refeição</h2>

      {/* Tipo de refeição */}
      <label className="text-sm text-gray-600">Tipo:</label>
      <select
        className="mt-1 mb-4 p-3 rounded-xl border w-full"
        value={mealType}
        onChange={(e) => setMealType(e.target.value)}
      >
        <option value="">Selecione...</option>
        {mealOptions.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>

      {/* Descrição */}
      <label className="text-sm text-gray-600">Descrição:</label>
      <textarea
        className="mt-1 mb-4 p-3 rounded-xl border w-full"
        rows={3}
        placeholder="Ex: Frango grelhado + arroz + salada"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Calorias */}
      <label className="text-sm text-gray-600">Calorias:</label>
      <input
        className="mt-1 mb-4 p-3 rounded-xl border w-full"
        type="number"
        placeholder="Ex: 520"
        value={calories}
        onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
      />

      <div className="flex gap-3 mt-6">
        <button
          className="flex-1 py-3 rounded-xl bg-gray-200"
          onClick={() => router.back()}
        >
          Cancelar
        </button>

        <button
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-[#00C974] text-white"
          onClick={handleSave}
        >
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </div>
  );
}
