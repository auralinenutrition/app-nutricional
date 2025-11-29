"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { LogOut, Settings, RefreshCcw, Trash2, User, ArrowLeft } from "lucide-react";
import BottomBar from "@/components/home/BottomBar";

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setProfile(data));
  }, [user]);

  if (!user || !profile) {
    return <div className="p-6 text-center text-gray-500">Carregando...</div>;
  }

  const handleClearLocal = () => {
    localStorage.removeItem("quiz_completed");
    localStorage.removeItem("quizData");
    alert("Dados locais apagados.");
  };

  const handleRefazerQuiz = () => {
    handleClearLocal();
    router.push("/quiz");
  };

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>

      {/* Card Perfil */}
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={40} className="text-gray-600" />
        </div>

        <p className="mt-3 text-lg font-semibold">{profile.name}</p>
        <p className="text-gray-500 text-sm">{profile.email}</p>
      </div>

      {/* Ações */}
      <div className="space-y-3">
        <button
          onClick={() => router.push("/profile/edit")}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
        >
          <Settings className="text-gray-600" />
          <span className="font-medium">Editar Perfil</span>
        </button>

        <button
          onClick={handleRefazerQuiz}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
        >
          <RefreshCcw className="text-gray-600" />
          <span className="font-medium">Refazer Quiz</span>
        </button>

        <button
          onClick={handleClearLocal}
          className="w-full flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm"
        >
          <Trash2 className="text-gray-600" />
          <span className="font-medium">Limpar Dados Locais</span>
        </button>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 p-4 bg-red-50 rounded-xl shadow-sm text-red-600"
        >
          <LogOut />
          <span className="font-medium">Sair da Conta</span>
        </button>
      </div>
      <BottomBar />
    </div> 
  );
}
