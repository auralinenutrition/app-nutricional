"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ActionMenu from "./ActionMenu";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);

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

      {/* Action menu (posicionado acima do FAB) */}
      <ActionMenu open={open} onClose={() => setOpen(false)} />

      {/* FAB */}
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
