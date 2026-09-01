// Mock agenda service (agendamentos + bloqueios).
// Swap for real calls (GET /agendamentos, GET /bloqueios, POST /bloqueios) later.
import { delay } from "@/lib/mock/delay";
import { AGENDAMENTOS, BLOQUEIOS } from "@/lib/mock/seed";
import type { Agendamento, BloqueioAgenda } from "@/lib/types";

let agendamentos = [...AGENDAMENTOS];
let bloqueios = [...BLOQUEIOS];

export async function listarAgendamentos(): Promise<Agendamento[]> {
  return delay([...agendamentos].sort((a, b) => a.inicio.localeCompare(b.inicio)));
}

export async function listarBloqueios(): Promise<BloqueioAgenda[]> {
  return delay([...bloqueios]);
}

export type NovoBloqueioInput = Omit<BloqueioAgenda, "id">;

export async function criarBloqueio(input: NovoBloqueioInput): Promise<BloqueioAgenda> {
  const novo: BloqueioAgenda = { ...input, id: `b${Date.now()}` };
  bloqueios = [novo, ...bloqueios];
  return delay(novo);
}

export async function removerBloqueio(id: string): Promise<void> {
  bloqueios = bloqueios.filter((b) => b.id !== id);
  return delay(undefined);
}

export async function atualizarStatusAgendamento(
  id: string,
  status: Agendamento["status"],
): Promise<Agendamento> {
  agendamentos = agendamentos.map((a) => (a.id === id ? { ...a, status } : a));
  return delay(agendamentos.find((a) => a.id === id)!);
}
