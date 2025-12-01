"use client";

import { useState } from "react";
import AInput from "@/components/ui/AInput";
import AButton from "@/components/ui/AButton";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createBrowserSupabase } from "@/lib/supabase/browser";

export default function Login() {
  const { signIn } = useAuth();
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      // 1) Autentica no Supabase
      await signIn(email, senha);

      // 2) NÃO pegar sessão aqui — ela ainda não existe imediatamente.
      // O AuthContext vai atualizar automaticamente.

      // 3) Atualizar last_login no backend (agora autenticado)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.id) {
        await supabase
          .from("users")
          .update({ last_login: new Date().toISOString() })
          .eq("id", user.id);
      }

      // 4) Redireciona
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
