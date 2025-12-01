"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import AInput from "@/components/ui/AInput";
import AButton from "@/components/ui/AButton";
import { finishQuizAfterSignup } from "@/services/quiz/finishQuizAfterSignup";

export default function SignupPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);

      // 1) Criar usuário no Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
      });

      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) throw new Error("Erro ao localizar usuário.");

      // 2) Pegar plano selecionado
      const plano =
        new URLSearchParams(window.location.search).get("plano") ?? "free";

      // 3) Criar user no banco usando service role
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: nome, email, plan: plano }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao salvar usuário no banco.");
      }

      // 4) Salvar quiz
      await finishQuizAfterSignup(userId);

      const planResp = await fetch("/api/ai/generate-plan", { method: "POST" });

    if (!planResp.ok) {
      console.error("Falha ao gerar plano", await planResp.text());
    }

      // 5) Limpar
      localStorage.removeItem("quizData");
      localStorage.removeItem("quiz_completed");

      // 6) Redirecionar
      router.push("/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#0A0A0A]">Criar conta</h1>

        <div className="flex flex-col gap-4">
          <AInput
            label="Nome"
            value={nome}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNome(e.target.value)
            }
          />

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

          <AButton type="button" onClick={handleSignup}>
            {loading ? "Criando conta..." : "Criar conta"}
          </AButton>
        </div>
      </div>
    </div>
  );
}
