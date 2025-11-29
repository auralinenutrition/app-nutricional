// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import AppModalProvider from "@/contexts/AppModalContext";


export const metadata: Metadata = {
  title: "Auraline Nutrition",
  description: "Seu guia personalizado para uma vida mais saudável",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>
          <AppModalProvider>
            {children}
          </AppModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
