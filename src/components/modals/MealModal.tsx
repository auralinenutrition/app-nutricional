"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { inferMealType, mapTypeToTitle } from "@/lib/meals";
import { uploadMealPhoto } from "@/services/meals/uploadMealPhoto";

interface MealModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: (saved: any) => void; // Replace 'any' with a more specific type if available
}

export default function MealModal({ open, onClose, onSaved }: MealModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  async function handleSubmit() {
    if (!file) return alert("Selecione uma imagem!");
    if (!user) return alert("Faça login!");

    setLoading(true);

    const uploadRes = await uploadMealPhoto(file);
    const publicUrl = uploadRes.publicUrl;

    const nutritionalData = await fetch("/api/meals/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: publicUrl }),
    }).then((r) => r.json());

    const type = inferMealType(new Date());
    const title = mapTypeToTitle(type);

    const mealBody = {
      type,
      title,
      image_url: publicUrl,
      description: nutritionalData.description ?? "",
      calories: nutritionalData.calories ?? 0,
      protein: nutritionalData.protein ?? 0,
      carbs: nutritionalData.carbs ?? 0,
      fat: nutritionalData.fat ?? 0,
      portion_size: nutritionalData.portion_size ?? "",
    };

    const saved = await fetch("/api/meals/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mealBody),
    }).then((r) => r.json());

    setLoading(false);
    window.dispatchEvent(new Event("mealSaved"));
    onSaved(saved);
    onClose();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end"
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="bg-white w-full p-5 rounded-t-3xl shadow-xl"
        >
          <h2 className="text-lg font-semibold mb-4">Registrar refeição</h2>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleSelectFile}
          />

          {!preview ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 rounded-xl bg-[#00C974] text-white font-medium"
            >
              Selecionar foto
            </button>
          ) : (
            <>
              <img
                src={preview}
                className="w-full rounded-xl object-cover max-h-80"
              />

              <div className="flex gap-3 mt-4">
                <button
                  className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-700"
                  onClick={() => {
                    setPreview(null);
                    setFile(null);
                  }}
                >
                  Trocar foto
                </button>

                <button
                  className="flex-1 py-3 rounded-xl bg-[#00C974] text-white font-medium disabled:opacity-60"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? "Processando..." : "Confirmar"}
                </button>
              </div>
            </>
          )}

          <button
            className="mt-4 text-center w-full text-gray-600"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
