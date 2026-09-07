// Client HTTP fino para a API real do Studio Flow (Kotlin + Spring Boot).
// Os `services/*.ts` só chamam este client quando NEXT_PUBLIC_API_URL está
// configurada; caso contrário, continuam usando dados mockados (ver README).
import { getToken } from "@/lib/auth/storage";

export const SESSAO_EXPIRADA_EVENT = "studio-flow:sessao-expirada";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function apiConfigurada(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL);
}

function baseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL não configurada.");
  return url.replace(/\/$/, "");
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Anexa o header Authorization com o token salvo. Padrão: true. */
  autenticado?: boolean;
  /** Usa este token em vez do salvo em storage — útil logo após o login, antes da sessão ser persistida. */
  tokenOverride?: string;
}

export async function apiFetch<T>(
  path: string,
  { body, autenticado = true, tokenOverride, headers, ...init }: ApiFetchOptions = {},
): Promise<T> {
  const finalHeaders = new Headers(headers);
  finalHeaders.set("Content-Type", "application/json");
  if (autenticado) {
    const token = tokenOverride ?? getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      ...init,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.", 0);
  }

  if (response.status === 401 && typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSAO_EXPIRADA_EVENT));
  }

  if (response.status === 204) return undefined as T;

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    const mensagem: string =
      (data && (data.mensagem || data.message || data.erro || data.error)) || `Erro inesperado (${response.status}).`;
    throw new ApiError(mensagem, response.status);
  }

  return data as T;
}
