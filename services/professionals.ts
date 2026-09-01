// Mock professionals service.
// Swap for real calls (GET/POST/PATCH /profissionais) later; keep these signatures.
import { delay } from "@/lib/mock/delay";
import { PROFISSIONAIS } from "@/lib/mock/seed";
import type { Profissional } from "@/lib/types";

let profissionais = [...PROFISSIONAIS];

export async function listarProfissionais(): Promise<Profissional[]> {
  return delay([...profissionais]);
}

export async function obterProfissional(id: string): Promise<Profissional | undefined> {
  return delay(profissionais.find((p) => p.id === id));
}

export type NovoProfissionalInput = Omit<Profissional, "id" | "criadoEm">;

export async function criarProfissional(input: NovoProfissionalInput): Promise<Profissional> {
  const novo: Profissional = {
    ...input,
    id: `p${Date.now()}`,
    criadoEm: new Date().toISOString().slice(0, 10),
  };
  profissionais = [novo, ...profissionais];
  return delay(novo);
}

export async function atualizarProfissional(
  id: string,
  patch: Partial<Profissional>,
): Promise<Profissional> {
  profissionais = profissionais.map((p) => (p.id === id ? { ...p, ...patch } : p));
  const atualizado = profissionais.find((p) => p.id === id)!;
  return delay(atualizado);
}

export async function removerProfissional(id: string): Promise<void> {
  profissionais = profissionais.filter((p) => p.id !== id);
  return delay(undefined);
}
