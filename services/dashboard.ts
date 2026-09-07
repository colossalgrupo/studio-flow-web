// Serviço de resumo do dashboard.
// Chama a API real (/dashboard/resumo) quando NEXT_PUBLIC_API_URL está
// configurada; caso contrário usa dados mockados (ver README).
import { apiConfigurada, apiFetch } from "@/lib/api/client";
import { delay } from "@/lib/mock/delay";
import { AGENDAMENTOS, PROFISSIONAIS, TRANSACOES } from "@/lib/mock/seed";
import type { DashboardResumo } from "@/lib/types";
import { listarRepasses } from "@/services/financial";

interface BackendDashboardResumo {
  totalAgendamentosPeriodo: number;
  faturamentoPeriodo: number;
  repassesPendentes: number;
  profissionaisAtivos: number;
  variacaoFaturamento: number;
  faturamentoPorDia: { data: string; valor: number }[];
}

export async function obterResumoDashboard(): Promise<DashboardResumo> {
  if (apiConfigurada()) {
    return apiFetch<BackendDashboardResumo>("/dashboard/resumo");
  }

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
