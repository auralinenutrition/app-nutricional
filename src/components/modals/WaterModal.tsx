// src/components/modals/WaterModal.tsx
"use client";

import React, { useState } from "react";
import AButton from "@/components/ui/AButton";
import AInput from "@/components/ui/AInput";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import waterService from "@/services/home/waterService";

type Props = {
  open: boolean;
  data?: any;
  onClose: () => void;
  onSaved?: () => void;
};

export default function WaterModal({ open, data, onClose, onSaved }: Props) {
  const [ml, setMl] = useState<number>(250);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSave = async () => {
    try {
      setLoading(true);
      // pega user id do supabase
      const { data: sessionData } = await supabase.auth.getUser();
      const userId = sessionData?.user?.id;
      if (!userId) throw new Error("Usuário não autenticado.");

      const res = await waterService.addWaterRecord(userId, ml);
      if (!res.success) throw new Error(res.error || "Erro ao salvar água.");

      // opcional: chamar callback para recarregar metas
      onSaved?.();

      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao salvar água.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onClose()}
      />
      <div className="relative bg-white w-full max-w-md rounded-t-2xl p-6 mb-8 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Registrar água</h3>

        <p className="text-sm text-gray-600 mb-4">
          Adicione a quantidade em ml (ex.: 250)
        </p>

        <AInput
          type="number"
          value={String(ml)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMl(Number(e.target.value))}
        />

        <div className="flex gap-3 mt-6">
          <AButton variant="ghost" onClick={onClose}>Cancelar</AButton>
          <AButton onClick={handleSave} disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </AButton>
        </div>
      </div>
    </div>
  );
}
