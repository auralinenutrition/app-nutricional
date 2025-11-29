// src/hooks/useAppModal.ts
import { useContext } from "react";
import { AppModalContext } from "@/contexts/AppModalContext";

export default function useAppModal() {
  return useContext(AppModalContext);
}
