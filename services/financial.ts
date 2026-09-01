// Mock financial service (extrato, repasses, split por transação).
// Swap for real calls (GET /financeiro/transacoes, GET /financeiro/repasses) later.
import { delay } from "@/lib/mock/delay";
import { REPASSES, TRANSACOES } from "@/lib/mock/seed";
import type { Repasse, Transacao } from "@/lib/types";

let repasses = [...REPASSES];

export async function listarTransacoes(): Promise<Transacao[]> {
  return delay([...TRANSACOES].sort((a, b) => b.data.localeCompare(a.data)));
}

export async function listarRepasses(): Promise<Repasse[]> {
  return delay([...repasses].sort((a, b) => b.periodoFim.localeCompare(a.periodoFim)));
}

export async function marcarRepasseComoRealizado(id: string): Promise<Repasse> {
  repasses = repasses.map((r) =>
    r.id === id
      ? { ...r, status: "realizado", dataRealizado: new Date().toISOString().slice(0, 10) }
      : r,
  );
  return delay(repasses.find((r) => r.id === id)!);
}
