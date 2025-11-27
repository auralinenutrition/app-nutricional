"use client";

import { Utensils, Droplet, Scale, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

type Props = {
  open: boolean;
  onClose?: () => void;
};

export default function ActionMenu({ open, onClose }: Props) {
  const router = useRouter();

  const actions = [
    {
      key: "meal",
      label: "Registrar refeição",
      icon: <Utensils size={20} strokeWidth={2.2} className="text-[#00C974]" />,
      route: "/meals/new",
    },
    {
      key: "water",
      label: "Registrar água",
      icon: <Droplet size={20} strokeWidth={2.2} className="text-[#00C974]" />,
      route: "/water",
    },
    {
      key: "weight",
      label: "Registrar peso",
      icon: <Scale size={20} strokeWidth={2.2} className="text-[#00C974]" />,
      route: "/progress/weight",
    },
    {
      key: "photo",
      label: "Foto de progresso",
      icon: <Camera size={20} strokeWidth={2.2} className="text-[#00C974]" />,
      route: "/progress/photo",
    },
  ];

  if (!open) return null;

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
              router.push(a.route);
              if (onClose) onClose();
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
