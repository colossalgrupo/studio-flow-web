"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Usuario } from "@/lib/types";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, login as loginService, logout as logoutService } from "@/services/auth";
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

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (token && raw) {
      try {
        setUsuario(JSON.parse(raw) as Usuario);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    }
    setCarregando(false);
  }, []);

  const entrar = useCallback(async (payload: LoginPayload) => {
    const { token, usuario: user } = await loginService(payload);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=604800`;
    setUsuario(user);
  }, []);

  const sair = useCallback(async () => {
    await logoutService();
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
    setUsuario(null);
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
