"use client";

import { CreditCard, Loader2, QrCode, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { statusRepasseLabel, statusRepasseTone } from "@/lib/status";
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import type { Profissional, Repasse, Transacao } from "@/lib/types";
import { listarRepasses, listarTransacoes, marcarRepasseComoRealizado } from "@/services/financial";
import { listarProfissionais } from "@/services/professionals";

const TIPO_LABEL: Record<Transacao["tipo"], string> = {
  pix: "Pix",
  cartao_credito: "Cartão de crédito",
  cartao_debito: "Cartão de débito",
};

export default function FinanceiroPage() {
  const [aba, setAba] = useState<"extrato" | "repasses">("extrato");
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [repasses, setRepasses] = useState<Repasse[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState<string | null>(null);

  function carregar() {
    setCarregando(true);
    Promise.all([listarTransacoes(), listarRepasses(), listarProfissionais()]).then(([t, r, p]) => {
      setTransacoes(t);
      setRepasses(r);
      setProfissionais(p);
      setCarregando(false);
    });
  }

  useEffect(carregar, []);

  const nomeProfissional = (id: string) => profissionais.find((p) => p.id === id)?.nome ?? "—";

  const totalPlataforma = transacoes.reduce((acc, t) => acc + t.taxaPlataforma, 0);
  const totalEstabelecimento = transacoes.reduce((acc, t) => acc + t.valorEstabelecimento, 0);
  const totalPendente = repasses.filter((r) => r.status === "pendente").reduce((acc, r) => acc + r.valorLiquido, 0);

  async function marcarRealizado(id: string) {
    setProcessando(id);
    await marcarRepasseComoRealizado(id);
    const atualizados = await listarRepasses();
    setRepasses(atualizados);
    setProcessando(null);
  }

  return (
    <div>
      <PageHeader title="Financeiro" description="Extrato de recebimentos e repasses aos profissionais" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Receita do estabelecimento" value={formatCurrency(totalEstabelecimento)} icon={Wallet} tone="accent" />
        <StatCard label="Taxa da plataforma" value={formatCurrency(totalPlataforma)} icon={CreditCard} tone="gold" />
        <StatCard label="Repasses pendentes" value={formatCurrency(totalPendente)} icon={QrCode} tone="rose" />
      </div>

      <div className="mt-6 mb-4 flex gap-2">
        <button
          onClick={() => setAba("extrato")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium",
            aba === "extrato" ? "bg-accent text-accent-foreground" : "bg-surface text-muted border border-border",
          )}
        >
          Extrato de recebimentos
        </button>
        <button
          onClick={() => setAba("repasses")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium",
            aba === "repasses" ? "bg-accent text-accent-foreground" : "bg-surface text-muted border border-border",
          )}
        >
          Repasses por profissional
        </button>
      </div>

      <Card>
        <CardContent className="p-0">
          {carregando ? (
            <div className="flex h-40 items-center justify-center text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : aba === "extrato" ? (
            <Table>
              <Thead>
                <Tr>
                  <Th>Data</Th>
                  <Th>Cliente</Th>
                  <Th>Profissional</Th>
                  <Th>Forma</Th>
                  <Th>Valor total</Th>
                  <Th>Plataforma</Th>
                  <Th>Estabelecimento</Th>
                  <Th>Profissional (repasse)</Th>
                </Tr>
              </Thead>
              <Tbody>
                {transacoes.map((t) => (
                  <Tr key={t.id}>
                    <Td>{formatDateTime(t.data)}</Td>
                    <Td className="font-medium">{t.clienteNome}</Td>
                    <Td>{nomeProfissional(t.profissionalId)}</Td>
                    <Td>
                      <Badge tone="neutral">{TIPO_LABEL[t.tipo]}</Badge>
                    </Td>
                    <Td>{formatCurrency(t.valorTotal)}</Td>
                    <Td className="text-gold">{formatCurrency(t.taxaPlataforma)}</Td>
                    <Td className="text-accent">{formatCurrency(t.valorEstabelecimento)}</Td>
                    <Td className="text-rose">{formatCurrency(t.valorProfissional)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Profissional</Th>
                  <Th>Período</Th>
                  <Th>Bruto</Th>
                  <Th>Taxa plataforma</Th>
                  <Th>Líquido a repassar</Th>
                  <Th>Status</Th>
                  <Th>Ação</Th>
                </Tr>
              </Thead>
              <Tbody>
                {repasses.map((r) => (
                  <Tr key={r.id}>
                    <Td className="font-medium">{nomeProfissional(r.profissionalId)}</Td>
                    <Td>
                      {formatDate(r.periodoInicio)} – {formatDate(r.periodoFim)}
                    </Td>
                    <Td>{formatCurrency(r.valorBruto)}</Td>
                    <Td className="text-gold">{formatCurrency(r.valorComissaoPlataforma)}</Td>
                    <Td className="font-medium">{formatCurrency(r.valorLiquido)}</Td>
                    <Td>
                      <Badge tone={statusRepasseTone(r.status)}>{statusRepasseLabel(r.status)}</Badge>
                    </Td>
                    <Td>
                      {r.status === "pendente" ? (
                        <Button size="sm" variant="outline" disabled={processando === r.id} onClick={() => marcarRealizado(r.id)}>
                          {processando === r.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                          Marcar como pago
                        </Button>
                      ) : (
                        <span className="text-xs text-muted">{r.dataRealizado && formatDate(r.dataRealizado)}</span>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
