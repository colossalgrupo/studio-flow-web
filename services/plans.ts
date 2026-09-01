// Mock subscription-plan service.
// Swap for real calls (GET /assinatura, POST /assinatura/trocar-plano) later.
import { delay } from "@/lib/mock/delay";
import { PLANOS } from "@/lib/mock/seed";
import type { Plano, PlanoId } from "@/lib/types";

let planoAtualId: PlanoId = "black";

export async function listarPlanos(): Promise<Plano[]> {
  return delay([...PLANOS]);
}

export async function obterPlanoAtual(): Promise<Plano> {
  return delay(PLANOS.find((p) => p.id === planoAtualId)!);
}

export async function trocarPlano(id: PlanoId): Promise<Plano> {
  planoAtualId = id;
  return delay(PLANOS.find((p) => p.id === id)!, 600);
}
