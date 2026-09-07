// Serviço de agenda (agendamentos + bloqueios).
// Chama a API real (/agendamentos, /bloqueios) quando NEXT_PUBLIC_API_URL está
// configurada; caso contrário usa dados mockados (ver README).
import { apiConfigurada, apiFetch } from "@/lib/api/client";
import { delay } from "@/lib/mock/delay";
import { AGENDAMENTOS, BLOQUEIOS } from "@/lib/mock/seed";
import type { Agendamento, BloqueioAgenda, StatusAgendamento } from "@/lib/types";

let agendamentos = [...AGENDAMENTOS];
let bloqueios = [...BLOQUEIOS];

type BackendStatusAgendamento = "PENDENTE_PAGAMENTO" | "CONFIRMADO" | "CANCELADO" | "CONCLUIDO";

interface BackendAgendamentoDetalhado {
  id: string;
  clienteId: string;
  clienteNome: string;
  profissionalId: string;
  profissionalNome: string;
  servicoId: string;
  servicoNome: string;
  inicio: string;
  fim: string;
  valor: number;
  status: BackendStatusAgendamento;
}

interface BackendBloqueio {
  id: string;
  profissionalId: string;
  inicio: string;
  fim: string;
  motivo: string;
}

const STATUS_BACKEND_PARA_FRONT: Record<BackendStatusAgendamento, StatusAgendamento> = {
  PENDENTE_PAGAMENTO: "pendente",
  CONFIRMADO: "confirmado",
  CANCELADO: "cancelado",
  CONCLUIDO: "concluido",
};

const STATUS_FRONT_PARA_BACKEND: Record<StatusAgendamento, BackendStatusAgendamento> = {
  pendente: "PENDENTE_PAGAMENTO",
  confirmado: "CONFIRMADO",
  cancelado: "CANCELADO",
  concluido: "CONCLUIDO",
};

function paraAgendamento(a: BackendAgendamentoDetalhado): Agendamento {
  return {
    id: a.id,
    clienteNome: a.clienteNome,
    profissionalId: a.profissionalId,
    servicoId: a.servicoId,
    inicio: a.inicio,
    fim: a.fim,
    status: STATUS_BACKEND_PARA_FRONT[a.status],
    valor: a.valor,
  };
}

function paraBloqueio(b: BackendBloqueio): BloqueioAgenda {
  return { id: b.id, profissionalId: b.profissionalId, inicio: b.inicio, fim: b.fim, motivo: b.motivo };
}

export async function listarAgendamentos(): Promise<Agendamento[]> {
  if (apiConfigurada()) {
    const dados = await apiFetch<BackendAgendamentoDetalhado[]>("/agendamentos/estabelecimento");
    return dados.map(paraAgendamento).sort((a, b) => a.inicio.localeCompare(b.inicio));
  }
  return delay([...agendamentos].sort((a, b) => a.inicio.localeCompare(b.inicio)));
}

export async function listarBloqueios(): Promise<BloqueioAgenda[]> {
  if (apiConfigurada()) {
    const dados = await apiFetch<BackendBloqueio[]>("/bloqueios");
    return dados.map(paraBloqueio);
  }
  return delay([...bloqueios]);
}

export type NovoBloqueioInput = Omit<BloqueioAgenda, "id">;

export async function criarBloqueio(input: NovoBloqueioInput): Promise<BloqueioAgenda> {
  if (apiConfigurada()) {
    const criado = await apiFetch<BackendBloqueio>("/bloqueios", { method: "POST", body: input });
    return paraBloqueio(criado);
  }

  const novo: BloqueioAgenda = { ...input, id: `b${Date.now()}` };
  bloqueios = [novo, ...bloqueios];
  return delay(novo);
}

export async function removerBloqueio(id: string): Promise<void> {
  if (apiConfigurada()) {
    await apiFetch<void>(`/bloqueios/${id}`, { method: "DELETE" });
    return;
  }
  bloqueios = bloqueios.filter((b) => b.id !== id);
  return delay(undefined);
}

export async function atualizarStatusAgendamento(
  id: string,
  status: StatusAgendamento,
): Promise<Agendamento> {
  if (apiConfigurada()) {
    await apiFetch<unknown>(`/agendamentos/${id}/status`, {
      method: "PATCH",
      body: { status: STATUS_FRONT_PARA_BACKEND[status] },
    });
    const atualizados = await listarAgendamentos();
    const atualizado = atualizados.find((a) => a.id === id);
    if (!atualizado) throw new Error("Agendamento não encontrado após atualização.");
    return atualizado;
  }

  agendamentos = agendamentos.map((a) => (a.id === id ? { ...a, status } : a));
  return delay(agendamentos.find((a) => a.id === id)!);
}
