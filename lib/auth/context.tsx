"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiConfigurada, SESSAO_EXPIRADA_EVENT } from "@/lib/api/client";
import { getToken, getUsuarioSalvo, limparSessao, salvarSessao } from "@/lib/auth/storage";
import type { Usuario } from "@/lib/types";
import { login as loginService, logout as logoutService, obterUsuarioLogado } from "@/services/auth";
import type { LoginPayload } from "@/services/auth";

interface AuthState {
  usuario: Usuario | null;
  carregando: boolean;
  autenticado: boolean;
  entrar: (payload: LoginPayload) => Promise<void>;
  sair: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  const sair = useCallback(async () => {
    await logoutService();
    limparSessao();
    setUsuario(null);
  }, []);

  useEffect(() => {
    let cancelado = false;

    async function restaurarSessao() {
      const token = getToken();
      const usuarioSalvo = getUsuarioSalvo();
      if (!token || !usuarioSalvo) {
        setCarregando(false);
        return;
      }

      // Com a API real configurada, valida o token junto ao backend em vez de
      // confiar apenas no que está salvo localmente.
      if (apiConfigurada()) {
        try {
          const usuarioAtualizado = await obterUsuarioLogado();
          if (!cancelado) setUsuario(usuarioAtualizado);
        } catch {
          if (!cancelado) limparSessao();
        }
      } else {
        setUsuario(usuarioSalvo);
      }
      if (!cancelado) setCarregando(false);
    }

    restaurarSessao();
    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    function aoExpirar() {
      limparSessao();
      setUsuario(null);
    }
    window.addEventListener(SESSAO_EXPIRADA_EVENT, aoExpirar);
    return () => window.removeEventListener(SESSAO_EXPIRADA_EVENT, aoExpirar);
  }, []);

  const entrar = useCallback(async (payload: LoginPayload) => {
    const { token, usuario: user } = await loginService(payload);
    salvarSessao(token, user);
    setUsuario(user);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando, autenticado: !!usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
}
