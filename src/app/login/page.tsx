"use client";

import { useState } from "react";
import AInput from "@/components/ui/AInput";
import AButton from "@/components/ui/AButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const { user, signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // 1) autenticar
      await signIn(email, senha);

      // 2) recuperar usuário logado
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user?.id;

      if (!userId) {
        throw new Error("Não foi possível identificar o usuário logado.");
      }

      // 3) atualizar last_login
      await supabase
        .from("users")
        .update({
          last_login: new Date().toISOString(),
        })
        .eq("id", userId);

      // 4) redirecionar
      router.push("/home");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#0A0A0A]">
          Bem-vindo de volta
        </h1>

        <div className="flex flex-col gap-4">
          <AInput
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />

          <AInput
            label="Senha"
            type="password"
            value={senha}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSenha(e.target.value)
            }
          />

          <AButton type="button" onClick={handleLogin}>
            {loading ? "Entrando..." : "Entrar"}
          </AButton>

          <p className="text-center text-sm mt-4 text-[#6F6F6F]">
            Ainda não tem conta?
          </p>
          <p
            onClick={() => router.push("/quiz")}
            className="text-center text-sm font-semibold text-[#00C974] cursor-pointer"
          >
            Complete o quiz para começar
          </p>
        </div>
      </div>
    </div>
  );
}
