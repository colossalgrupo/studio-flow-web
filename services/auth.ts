// Serviço de autenticação.
// Chama a API real do Studio Schedulle (POST /auth/login, GET /auth/me) quando
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

interface BackendAuthResponse {
  token: string;
  tipoPerfil: "EMPREENDEDOR" | "CLIENTE";
  nome: string;
  email: string;
}

interface BackendMeResponse {
  id: string;
  nome: string;
  email: string;
  tipoPerfil: "EMPREENDEDOR" | "CLIENTE";
}

/** Busca o nome do estabelecimento para exibir no painel; tolera o empreendedor ainda não ter cadastrado um. */
async function obterNomeDoNegocio(tokenOverride?: string): Promise<string> {
  try {
    const estabelecimento = await apiFetch<{ nome: string }>("/estabelecimentos/me", { tokenOverride });
    return estabelecimento.nome;
  } catch {
    return "";
  }
}

/** Este painel é exclusivo do empreendedor — cliente final usa o app mobile. */
function garantirEmpreendedor(tipoPerfil: "EMPREENDEDOR" | "CLIENTE") {
  if (tipoPerfil !== "EMPREENDEDOR") {
    throw new Error("Esta é a área de gestão do empreendedor. Use o app Studio Schedulle para clientes.");
  }
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  if (apiConfigurada()) {
    try {
      const resposta = await apiFetch<BackendAuthResponse>("/auth/login", {
        method: "POST",
        body: payload,
        autenticado: false,
      });
      garantirEmpreendedor(resposta.tipoPerfil);
      const negocio = await obterNomeDoNegocio(resposta.token);
      const usuario: Usuario = { id: resposta.email, nome: resposta.nome, email: resposta.email, negocio };
      return { token: resposta.token, usuario };
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
    const me = await apiFetch<BackendMeResponse>("/auth/me");
    garantirEmpreendedor(me.tipoPerfil);
    const negocio = await obterNomeDoNegocio();
    return { id: me.id, nome: me.nome, email: me.email, negocio };
  }
  return delay(USUARIO_ATUAL, 200);
}

export async function logout(): Promise<void> {
  // O backend usa JWT stateless — não existe endpoint de logout, a sessão é
  // encerrada localmente (ver lib/auth/storage.ts).
  return delay(undefined, 150);
}
