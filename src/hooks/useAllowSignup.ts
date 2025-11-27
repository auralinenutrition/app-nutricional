"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useAllowSignup() {
  const router = useRouter();
  const params = useSearchParams();

  // Permite signup SOMENTE se vier da tela de planos
  const allowed = params.get("from") === "planos";

  useEffect(() => {
    if (!allowed) {
      router.push("/login"); // ou "/" se quiser
    }
  }, [allowed, router]);
}
