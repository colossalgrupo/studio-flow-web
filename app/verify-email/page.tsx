"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { verificarEmail } from "@/services/auth";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { definirSessao } = useAuth();
  const [erro, setErro] = useState<string | null>(null);
  const jaTentou = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setErro("Link de confirmação inválido — falta o token.");
      return;
    }
    if (jaTentou.current) return;
    jaTentou.current = true;

    verificarEmail(token)
      .then(({ token: jwt, usuario }) => {
        definirSessao(jwt, usuario);
        router.replace("/dashboard");
      })
      .catch((err) => {
        setErro(err instanceof Error ? err.message : "Não foi possível confirmar seu e-mail.");
      });
  }, [searchParams, definirSessao, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-bold text-accent-foreground mx-auto">
          SF
        </div>
        {erro ? (
          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3 text-left text-sm text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{erro}</span>
            </div>
            <p className="mt-4 text-sm text-muted">
              Se o link expirou, você pode pedir um novo direto na tela de login.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="text-sm">Confirmando seu e-mail…</p>
          </div>
        )}
      </div>
    </div>
  );
}
