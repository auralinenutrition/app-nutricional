// src/contexts/AppModalContext.tsx
"use client";

import { createContext, useContext, useState } from "react";

type ModalType = "meal" | "water" | "weight" | "photo" | null;

type AppModalContextType = {
  modal: ModalType;
  data: any;
  openMeal: (data?: any) => void;
  openWater: (data?: any) => void;
  openWeight: (data?: any) => void;
  openPhoto: (data?: any) => void;
  close: () => void;
};

export const AppModalContext = createContext<AppModalContextType | undefined>(
  undefined
);

export function AppModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalType>(null);
  const [data, setData] = useState<any>(null);

  function openMeal(data?: any) {
    setModal("meal");
    setData(data ?? null);
  }

  function openWater(data?: any) {
    setModal("water");
    setData(data ?? null);
  }

  function openWeight(data?: any) {
    setModal("weight");
    setData(data ?? null);
  }

  function openPhoto(data?: any) {
    setModal("photo");
    setData(data ?? null);
  }

  function close() {
    setModal(null);
    setData(null);
  }

  return (
    <AppModalContext.Provider
      value={{
        modal,
        data,
        openMeal,
        openWater,
        openWeight,
        openPhoto,
        close,
      }}
    >
      {children}
    </AppModalContext.Provider>
  );
}

// Hook seguro
export function useAppModal() {
  const ctx = useContext(AppModalContext);
  if (!ctx) {
    throw new Error("useAppModal must be used inside <AppModalProvider>");
  }
  return ctx;
}
