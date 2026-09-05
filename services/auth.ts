// Serviço de autenticação.
// Chama a API real do Studio Flow (POST /auth/login, GET /auth/me) quando
// NEXT_PUBLIC_API_URL está configurada; caso contrário usa dados mockados,
// para o painel continuar funcionando de forma independente (ver README).
import { ApiError, apiConfigurada, apiFetch } from "@/lib/api/client";
import { delay } from "@/lib/mock/delay";
import { USUARIO_ATUAL } from "@/lib/mock/seed";
import type { Usuario } from "@/lib/types";

export { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "@/lib/auth/storage";

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (apiConfigurada()) {
    try {
      return await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: payload,
        autenticado: false,
      });
    } catch (err) {
      if (err instanceof ApiError && (err.status === 401 || err.status === 400)) {
        throw new Error("Credenciais inválidas. Verifique o e-mail e a senha.");
      }
      throw err;
    }
  }

  const { email, senha } = payload;
  if (!email.includes("@") || senha.length < 4) {
    await delay(null, 400);
    throw new Error("Credenciais inválidas. Verifique o e-mail e a senha.");
  }
  return delay(
    {
      token: `mock-jwt-token.${btoa(email)}.${Date.now()}`,
      usuario: { ...USUARIO_ATUAL, email },
    },
    500,
  );
}

/** Valida a sessão atual junto ao backend e devolve os dados atualizados do usuário. */
export async function obterUsuarioLogado(): Promise<Usuario> {
  if (apiConfigurada()) {
    return apiFetch<Usuario>("/auth/me");
  }
  return delay(USUARIO_ATUAL, 200);
}

export async function logout(): Promise<void> {
  if (apiConfigurada()) {
    try {
      await apiFetch<void>("/auth/logout", { method: "POST" });
    } catch {
      // best-effort: a sessão local é limpa pelo chamador mesmo se o backend falhar.
    }
    return;
  }
  return delay(undefined, 150);
}
