"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

import AInput from "@/components/ui/AInput";
import AButton from "@/components/ui/AButton";

import quizService from "@/services/quizService";

export default function Signup() {
  const router = useRouter();
  const { signUp: signUpCtx } = useAuth(); // NÃO usar para criar conta

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);

      // 1) CRIAR USUÁRIO NO AUTH
      const { data, error } = await supabase.auth.signUp({
        email,
        password: senha,
        options: {
          emailRedirectTo: `${location.origin}/home`,
        },
      });

      if (error) throw error;

      // ID retornado pelo Supabase
      let userId: string | undefined = data.user?.id;

      if (!userId) {
        const session = await supabase.auth.getSession();
        userId = session.data.session?.user?.id ?? undefined;

        if (!userId) throw new Error("ID do usuário não encontrado.");
      }

      // 2) DEFINIR PLANO
      const planoSelecionado =
        new URLSearchParams(window.location.search).get("plano") ?? "free";

      // 3) INSERIR USUÁRIO NA TABELA users
      const { error: insertUserError } = await supabase.from("users").insert({
        id: userId,
        name: nome,
        email: email,
        plan: planoSelecionado,
        onboarding_done: true,
      });

      if (insertUserError) throw insertUserError;

      // 4) LER QUIZ DO LOCALSTORAGE
      const quizDataRaw = localStorage.getItem("quizData");
      if (!quizDataRaw) {
        router.push("/home");
        return;
      }

      const quizData = JSON.parse(quizDataRaw);

      const payload = {
        ...quizData,
        peso_atual: Number(quizData.peso_atual),
        altura: Number(quizData.altura),
        peso_desejado: Number(quizData.peso_desejado),
        dia_nascimento: String(quizData.dia_nascimento),
        mes_nascimento: String(quizData.mes_nascimento),
        ano_nascimento: String(quizData.ano_nascimento),
      };

      // 5) SALVAR QUIZ
      const saveRes = await quizService.saveQuizResponses(userId, payload);

      if (!saveRes.success) {
        await supabase.from("quiz_responses").insert({
          user_id: userId,
          ...payload,
          created_at: new Date().toISOString(),
        });
      }

      // 6) ATUALIZAR USER COM CAMPOS DO QUIZ
      await supabase
        .from("users")
        .update({
          peso_atual: payload.peso_atual,
          peso_inicial: payload.peso_atual,
          peso_desejado: payload.peso_desejado,
          altura: payload.altura,
          objetivo: payload.objetivo,
          nivel_treino: payload.nivel_treino,
          frequencia_semanal: payload.frequencia_treino,
        })
        .eq("id", userId);

      // 7) LIMPAR E IR PARA HOME
      localStorage.removeItem("quizData");
      localStorage.removeItem("quiz_completed");

      await new Promise((res) => setTimeout(res, 200));

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

          <p className="text-center text-sm mt-2 text-[#6F6F6F]">
            Já tem conta?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-[#00C974] font-semibold cursor-pointer"
            >
              Entrar
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
