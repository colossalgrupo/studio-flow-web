// Mock service-catalog service ("serviços" oferecidos pelo negócio).
// Swap for real calls (GET/POST/PATCH /servicos) later.
import { delay } from "@/lib/mock/delay";
import { SERVICOS } from "@/lib/mock/seed";
import type { Servico } from "@/lib/types";

let servicos = [...SERVICOS];

export async function listarServicos(): Promise<Servico[]> {
  return delay([...servicos]);
}

export type NovoServicoInput = Omit<Servico, "id">;

export async function criarServico(input: NovoServicoInput): Promise<Servico> {
  const novo: Servico = { ...input, id: `s${Date.now()}` };
  servicos = [novo, ...servicos];
  return delay(novo);
}

export async function atualizarServico(id: string, patch: Partial<Servico>): Promise<Servico> {
  servicos = servicos.map((s) => (s.id === id ? { ...s, ...patch } : s));
  const atualizado = servicos.find((s) => s.id === id)!;
  return delay(atualizado);
}

export async function removerServico(id: string): Promise<void> {
  servicos = servicos.filter((s) => s.id !== id);
  return delay(undefined);
}
