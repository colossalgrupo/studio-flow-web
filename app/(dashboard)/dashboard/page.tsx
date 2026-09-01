"use client";

import { CalendarCheck2, Loader2, TrendingUp, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { RevenueChart } from "@/components/revenue-chart";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { obterResumoDashboard } from "@/services/dashboard";
import { listarAgendamentos } from "@/services/schedule";
import { listarProfissionais } from "@/services/professionals";
import { listarServicos } from "@/services/services";
import type { Agendamento, DashboardResumo, Profissional, Servico } from "@/lib/types";
import { statusAgendamentoTone, statusAgendamentoLabel } from "@/lib/status";

export default function DashboardPage() {
  const [resumo, setResumo] = useState<DashboardResumo | null>(null);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([obterResumoDashboard(), listarAgendamentos(), listarProfissionais(), listarServicos()]).then(
      ([r, a, p, s]) => {
        setResumo(r);
        setAgendamentos(a);
        setProfissionais(p);
        setServicos(s);
        setCarregando(false);
      },
    );
  }, []);

  if (carregando || !resumo) {
    return (
      <div className="flex h-64 items-center justify-center text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const proximos = agendamentos
    .filter((a) => a.status === "confirmado" || a.status === "pendente")
    .slice(0, 6);

  const nomeProfissional = (id: string) => profissionais.find((p) => p.id === id)?.nome ?? "—";
  const nomeServico = (id: string) => servicos.find((s) => s.id === id)?.nome ?? "—";

  return (
    <div>
      <PageHeader title="Visão geral" description="Resumo do negócio nos últimos dias" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Agendamentos no período"
          value={String(resumo.totalAgendamentosPeriodo)}
          icon={CalendarCheck2}
          tone="accent"
        />
        <StatCard
          label="Faturamento no período"
          value={formatCurrency(resumo.faturamentoPeriodo)}
          icon={TrendingUp}
          tone="gold"
          helpText={`+${(resumo.variacaoFaturamento * 100).toFixed(1)}% vs. período anterior`}
        />
        <StatCard
          label="Repasses pendentes"
          value={formatCurrency(resumo.repassesPendentes)}
          icon={Wallet}
          tone="rose"
        />
        <StatCard
          label="Profissionais ativos"
          value={String(resumo.profissionaisAtivos)}
          icon={Users}
          tone="accent"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Faturamento por dia</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart dados={resumo.faturamentoPorDia} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos agendamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {proximos.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{a.clienteNome}</p>
                  <p className="truncate text-xs text-muted">
                    {nomeServico(a.servicoId)} · {nomeProfissional(a.profissionalId)}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted">{formatDateTime(a.inicio)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Agendamentos recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0 pt-4">
          <Table>
            <Thead>
              <Tr>
                <Th>Cliente</Th>
                <Th>Serviço</Th>
                <Th>Profissional</Th>
                <Th>Data</Th>
                <Th>Valor</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {agendamentos.slice(0, 8).map((a) => (
                <Tr key={a.id}>
                  <Td className="font-medium">{a.clienteNome}</Td>
                  <Td>{nomeServico(a.servicoId)}</Td>
                  <Td>{nomeProfissional(a.profissionalId)}</Td>
                  <Td>{formatDateTime(a.inicio)}</Td>
                  <Td>{formatCurrency(a.valor)}</Td>
                  <Td>
                    <Badge tone={statusAgendamentoTone(a.status)}>{statusAgendamentoLabel(a.status)}</Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
