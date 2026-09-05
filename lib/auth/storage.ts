// Persiste a sessão (token JWT + usuário) em localStorage e em cookie.
// O cookie existe para permitir a checagem de rota em `middleware.ts` (servidor),
// já que o middleware não tem acesso a localStorage.
import type { Usuario } from "@/lib/types";

export const AUTH_TOKEN_KEY = "studio-flow.token";
export const AUTH_USER_KEY = "studio-flow.user";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getUsuarioSalvo(): Usuario | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

export function salvarSessao(token: string, usuario: Usuario) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(usuario));
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function limparSessao() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
}
