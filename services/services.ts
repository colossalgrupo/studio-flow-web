// Serviço de catálogo ("serviços" oferecidos pelo negócio).
// Chama a API real (/servicos) quando NEXT_PUBLIC_API_URL está configurada;
// caso contrário usa dados mockados (ver README).
import { apiConfigurada, apiFetch } from "@/lib/api/client";
import { delay } from "@/lib/mock/delay";
import { SERVICOS } from "@/lib/mock/seed";
import type { Servico } from "@/lib/types";

let servicos = [...SERVICOS];

interface BackendServico {
  id: string;
  nome: string;
  categoria: string;
  duracaoMin: number;
  precoBase: number;
  profissionaisIds: string[];
  ativo: boolean;
}

function paraServico(s: BackendServico): Servico {
  return {
    id: s.id,
    nome: s.nome,
    categoria: s.categoria,
    duracaoMinutos: s.duracaoMin,
    precoBase: s.precoBase,
    profissionaisIds: s.profissionaisIds,
    ativo: s.ativo,
  };
}

function paraRequest(input: NovoServicoInput | Servico) {
  return {
    nome: input.nome,
    categoria: input.categoria,
    duracaoMin: input.duracaoMinutos,
    precoBase: input.precoBase,
    profissionaisIds: input.profissionaisIds,
    ativo: input.ativo,
  };
}

export async function listarServicos(): Promise<Servico[]> {
  if (apiConfigurada()) {
    const dados = await apiFetch<BackendServico[]>("/servicos/me");
    return dados.map(paraServico);
  }
  return delay([...servicos]);
}

export type NovoServicoInput = Omit<Servico, "id">;

export async function criarServico(input: NovoServicoInput): Promise<Servico> {
  if (apiConfigurada()) {
    const criado = await apiFetch<BackendServico>("/servicos", { method: "POST", body: paraRequest(input) });
    return paraServico(criado);
  }

  const novo: Servico = { ...input, id: `s${Date.now()}` };
  servicos = [novo, ...servicos];
  return delay(novo);
}

export async function atualizarServico(id: string, patch: Partial<Servico>): Promise<Servico> {
  if (apiConfigurada()) {
    const atual = await apiFetch<BackendServico>(`/servicos/${id}`);
    const mesclado: Servico = { ...paraServico(atual), ...patch };
    const atualizado = await apiFetch<BackendServico>(`/servicos/${id}`, {
      method: "PUT",
      body: paraRequest(mesclado),
    });
    return paraServico(atualizado);
  }

  servicos = servicos.map((s) => (s.id === id ? { ...s, ...patch } : s));
  const atualizado = servicos.find((s) => s.id === id)!;
  return delay(atualizado);
}

export async function removerServico(id: string): Promise<void> {
  if (apiConfigurada()) {
    await apiFetch<void>(`/servicos/${id}`, { method: "DELETE" });
    return;
  }
  servicos = servicos.filter((s) => s.id !== id);
  return delay(undefined);
}
