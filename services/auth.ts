// Mock authentication service.
// Swap the implementation for real calls to the Studio Flow API (POST /auth/login) later;
// the function signatures and return shapes are designed to stay the same.
import { delay } from "@/lib/mock/delay";
import { USUARIO_ATUAL } from "@/lib/mock/seed";
import type { Usuario } from "@/lib/types";

export const AUTH_TOKEN_KEY = "studio-flow.token";
export const AUTH_USER_KEY = "studio-flow.user";

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export async function login({ email, senha }: LoginPayload): Promise<LoginResponse> {
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

export async function logout(): Promise<void> {
  return delay(undefined, 150);
}
