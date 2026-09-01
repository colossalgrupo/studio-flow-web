"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth/context";

export default function Home() {
  const { autenticado, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (carregando) return;
    router.replace(autenticado ? "/dashboard" : "/login");
  }, [carregando, autenticado, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-muted">
      Carregando…
    </div>
  );
}
