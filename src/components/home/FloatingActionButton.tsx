"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ActionMenu from "./ActionMenu";
import { motion, AnimatePresence } from "framer-motion";
import useAppModal from "@/hooks/useAppModal";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const { openWater, openMeal } = useAppModal();

  const handleOpenWater = () => {
    setOpen(false);
    openWater({
      onSaved: () => {
        window.dispatchEvent(new Event("waterSaved"));
      },
    });
  };

  const handleOpenMeal = () => {
    setOpen(false);
    openMeal({
      onSaved: () => {
        window.dispatchEvent(new Event("mealSaved"));
      },
    });
  };

  return (
    <>
      {/* overlay suave com blur - fecha ao clicar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 backdrop-blur-sm bg-black/12"
          />
        )}
      </AnimatePresence>

      {/* Menu de ações — agora recebe a função de abrir o modal */}
      <ActionMenu
        open={open}
        onClose={() => setOpen(false)}
        onRegisterWater={handleOpenWater}
        onRegisterMeal={handleOpenMeal}
        // onRegisterWeight={handleOpenWeight}
        // onRegisterPhoto={handleOpenPhoto}
      />

      {/* BOTÃO FLUTUANTE */}
      <motion.button
        aria-label="Ações rápidas"
        onClick={() => setOpen((s) => !s)}
        className="fixed right-5 bottom-24 z-50 w-14 h-14 rounded-full bg-[#00C974] flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
        whileTap={{ scale: 0.95 }}
      >
        <Plus size={26} strokeWidth={3} className="text-white" />
      </motion.button>
    </>
  );
}
