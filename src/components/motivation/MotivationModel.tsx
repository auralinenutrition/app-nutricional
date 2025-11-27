"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export default function MotivationalModal({
  open,
  title,
  subtitle,
  onClose,
  primaryLabel = "Continuar",
  onPrimary,
  illustrationUrl,
  children, // 👈 ADICIONADO — permite gráfico ou qualquer conteúdo
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  primaryLabel?: string;
  onPrimary?: () => void;
  illustrationUrl?: string;
  children?: React.ReactNode; // 👈 SUPORTE A CHILDREN
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl p-6 shadow-lg animate-fade-in">
        
        {illustrationUrl && (
          <div className="w-full flex justify-center mb-4">
            <img
              src={illustrationUrl}
              alt="ilustração"
              className="h-28 object-contain"
            />
          </div>
        )}

        <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">{title}</h3>

        {subtitle && (
          <p className="text-[#6F6F6F] mb-6 leading-relaxed">{subtitle}</p>
        )}

        {/* 🔥 AQUI VAI O GRÁFICO OU QUALQUER COMPONENTE EXTRA */}
        {children && (
          <div className="mb-6 animate-slide-up">
            {children}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onClose} className="rounded-full">
            Fechar
          </Button>

          <Button
            onClick={onPrimary ?? onClose}
            className="rounded-full bg-[#00C974] hover:bg-[#00B368]"
          >
            {primaryLabel}
          </Button>
        </div>
      </div>

      {/* Animações simples */}
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.35s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
