// src/contexts/AppModalContext.tsx
"use client";

import React, { createContext, useCallback, useState } from "react";
import WaterModal from "@/components/modals/WaterModal";
import MealModal from "@/components/modals/MealModal";
// import WeightModal from "@/components/modals/WeightModal";
// import PhotoModal from "@/components/modals/PhotoModal";

type ModalState = {
  open: boolean;
  data?: any;
  onSaved?: (file: File | null) => void;
};

/* -----------------------------------
   Tipagem do Contexto
----------------------------------- */
type AppModalContextType = {
  openMeal: (opts?: {
    data?: any;
    onSaved?: (file: File | null) => void;
  }) => void;
  openWater: (opts?: {
    data?: any;
    onSaved?: (file: File | null) => void;
  }) => void;
  openWeight: (opts?: {
    data?: any;
    onSaved?: (file: File | null) => void;
  }) => void;
  openPhoto: (opts?: {
    data?: any;
    onSaved?: (file: File | null) => void;
  }) => void;
  close: () => void;
};

export const AppModalContext = createContext<AppModalContextType>({
  openMeal: () => {},
  openWater: () => {},
  openWeight: () => {},
  openPhoto: () => {},
  close: () => {},
});

export default function AppModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  /* Estados individuais por modal */
  const [mealModal, setMealModal] = useState<ModalState>({ open: false });
  const [waterModal, setWaterModal] = useState<ModalState>({ open: false });
  const [weightModal, setWeightModal] = useState<ModalState>({ open: false });
  const [photoModal, setPhotoModal] = useState<ModalState>({ open: false });

  /* -------------------------
     Funções de abertura
  --------------------------*/
  const openMeal = useCallback(
    (opts?: { data?: any; onSaved?: (file: File | null) => void }) => {
      setMealModal({ open: true, data: opts?.data, onSaved: opts?.onSaved });
    },
    []
  );

  const openWater = useCallback(
    (opts?: { data?: any; onSaved?: (file: File | null) => void }) => {
      setWaterModal({ open: true, data: opts?.data, onSaved: opts?.onSaved });
    },
    []
  );

  const openWeight = useCallback(
    (opts?: { data?: any; onSaved?: (file: File | null) => void }) => {
      setWeightModal({ open: true, data: opts?.data, onSaved: opts?.onSaved });
    },
    []
  );

  const openPhoto = useCallback(
    (opts?: { data?: any; onSaved?: (file: File | null) => void }) => {
      setPhotoModal({ open: true, data: opts?.data, onSaved: opts?.onSaved });
    },
    []
  );

  /* -------------------------
     Função Global de Close
  --------------------------*/
  const close = useCallback(() => {
    setMealModal({ open: false });
    setWaterModal({ open: false });
    setWeightModal({ open: false });
    setPhotoModal({ open: false });
  }, []);

  return (
    <AppModalContext.Provider
      value={{
        openMeal,
        openWater,
        openWeight,
        openPhoto,
        close,
      }}
    >
      {children}

      <WaterModal
        open={waterModal.open}
        data={waterModal.data}
        onClose={() => setWaterModal({ open: false })}
        onSaved={() => {
          waterModal.onSaved?.(null);
          setWaterModal({ open: false });
        }}
      />

      <MealModal
        open={mealModal.open}
        onClose={() => setMealModal({ open: false })}
        onSaved={(data) => {
          window.dispatchEvent(new Event("mealSaved")); // <-- AQUI
          if (mealModal.onSaved) mealModal.onSaved(data);
          setMealModal({ open: false });
        }}
      />
    </AppModalContext.Provider>
  );
}
