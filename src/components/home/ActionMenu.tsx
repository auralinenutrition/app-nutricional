"use client";

import { Utensils, Droplet, Scale, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose?: () => void;

  onRegisterMeal?: () => void;
  onRegisterWater?: () => void;
  onRegisterWeight?: () => void;
  onRegisterPhoto?: () => void;
};

export default function ActionMenu({
  open,
  onClose,
  onRegisterMeal,
  onRegisterWater,
  onRegisterWeight,
  onRegisterPhoto,
}: Props) {
  if (!open) return null;

  const actions = [
    {
      key: "meal",
      label: "Registrar refeição",
      icon: <Utensils size={20} strokeWidth={2.2} className="text-[#00C974]" />,
      onClick: onRegisterMeal,
    },
    {
      key: "water",
      label: "Registrar água",
      icon: <Droplet size={20} strokeWidth={2.2} className="text-[#00C974]" />,
      onClick: onRegisterWater,
    },
    {
      key: "weight",
      label: "Registrar peso",
      icon: <Scale size={20} strokeWidth={2.2} className="text-[#00C974]" />,
      onClick: onRegisterWeight,
    },
    {
      key: "photo",
      label: "Foto de progresso",
      icon: <Camera size={20} strokeWidth={2.2} className="text-[#00C974]" />,
      onClick: onRegisterPhoto,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed right-6 bottom-36 z-50 flex flex-col gap-3"
      >
        {actions.map((a, i) => (
          <motion.button
            key={a.key}
            onClick={() => {
              a.onClick && a.onClick();
              onClose && onClose();
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.06 } }}
            exit={{ opacity: 0, y: 8 }}
            className="flex items-center gap-3 w-56 bg-white rounded-2xl px-5 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
          >
            <div className="w-6 h-6 flex items-center justify-center">{a.icon}</div>
            <div className="text-[#0A0A0A] font-medium text-base">{a.label}</div>
          </motion.button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
