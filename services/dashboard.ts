// Mock dashboard summary service.
// Swap for a real call (GET /dashboard/resumo?periodo=...) later.
import { delay } from "@/lib/mock/delay";
import { AGENDAMENTOS, PROFISSIONAIS, TRANSACOES } from "@/lib/mock/seed";
import type { DashboardResumo } from "@/lib/types";
import { listarRepasses } from "@/services/financial";

export async function obterResumoDashboard(): Promise<DashboardResumo> {
  const repasses = await listarRepasses();
  const repassesPendentes = repasses
    .filter((r) => r.status === "pendente")
    .reduce((acc, r) => acc + r.valorLiquido, 0);

  const faturamentoPeriodo = TRANSACOES.reduce((acc, t) => acc + t.valorTotal, 0);
  const profissionaisAtivos = PROFISSIONAIS.filter((p) => p.status === "ativo").length;

  const porDia = new Map<string, number>();
  for (const t of TRANSACOES) {
    const dia = t.data.slice(0, 10);
    porDia.set(dia, (porDia.get(dia) ?? 0) + t.valorTotal);
  }
  const faturamentoPorDia = Array.from(porDia.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([data, valor]) => ({ data, valor }));

  return delay({
    totalAgendamentosPeriodo: AGENDAMENTOS.filter((a) => a.status !== "cancelado").length,
    faturamentoPeriodo,
    repassesPendentes,
    profissionaisAtivos,
    variacaoFaturamento: 0.128,
    faturamentoPorDia,
  });
}
