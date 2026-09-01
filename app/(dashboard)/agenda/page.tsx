"use client";

import { Ban, Loader2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatTime } from "@/lib/utils";
import { statusAgendamentoLabel, statusAgendamentoTone } from "@/lib/status";
import type { Agendamento, BloqueioAgenda, Profissional, Servico } from "@/lib/types";
import { listarProfissionais } from "@/services/professionals";
import { listarAgendamentos, listarBloqueios } from "@/services/schedule";
import { listarServicos } from "@/services/services";
import { NovoBloqueioModal } from "./novo-bloqueio-modal";

type ItemAgenda =
  | { tipo: "agendamento"; inicio: string; fim: string; dados: Agendamento }
  | { tipo: "bloqueio"; inicio: string; fim: string; dados: BloqueioAgenda };

export default function AgendaPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [bloqueios, setBloqueios] = useState<BloqueioAgenda[]>([]);
  const [profissionalId, setProfissionalId] = useState<string>("todos");
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  function carregar() {
    setCarregando(true);
    Promise.all([listarProfissionais(), listarServicos(), listarAgendamentos(), listarBloqueios()]).then(
      ([p, s, a, b]) => {
        setProfissionais(p);
        setServicos(s);
        setAgendamentos(a);
        setBloqueios(b);
        setCarregando(false);
      },
    );
  }

  useEffect(carregar, []);

  const nomeServico = (id: string) => servicos.find((s) => s.id === id)?.nome ?? "—";

  const porDia = useMemo(() => {
    const itens: ItemAgenda[] = [
      ...agendamentos
        .filter((a) => a.status !== "cancelado")
        .filter((a) => profissionalId === "todos" || a.profissionalId === profissionalId)
        .map((a): ItemAgenda => ({ tipo: "agendamento", inicio: a.inicio, fim: a.fim, dados: a })),
      ...bloqueios
        .filter((b) => profissionalId === "todos" || b.profissionalId === profissionalId)
        .map((b): ItemAgenda => ({ tipo: "bloqueio", inicio: b.inicio, fim: b.fim, dados: b })),
    ].sort((a, b) => a.inicio.localeCompare(b.inicio));

    const grupos = new Map<string, ItemAgenda[]>();
    for (const item of itens) {
      const dia = item.inicio.slice(0, 10);
      grupos.set(dia, [...(grupos.get(dia) ?? []), item]);
    }
    return Array.from(grupos.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [agendamentos, bloqueios, profissionalId]);

  return (
    <div>
      <PageHeader
        title="Agenda"
        description="Agendamentos futuros e bloqueios de horário por profissional"
        action={
          <Button onClick={() => setModalAberto(true)}>
            <Plus className="h-4 w-4" />
            Bloquear horário
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setProfissionalId("todos")}
          className={
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors " +
            (profissionalId === "todos"
              ? "border-accent bg-accent text-accent-foreground"
              : "border-border bg-surface text-foreground hover:bg-background")
          }
        >
          Todos
        </button>
        {profissionais.map((p) => (
          <button
            key={p.id}
            onClick={() => setProfissionalId(p.id)}
            className={
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors " +
              (profissionalId === p.id
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-surface text-foreground hover:bg-background")
            }
          >
            {p.nome}
          </button>
        ))}
      </div>

      {carregando ? (
        <div className="flex h-40 items-center justify-center text-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {porDia.map(([dia, itens]) => (
            <Card key={dia}>
              <CardContent>
                <h3 className="mb-3 text-sm font-semibold capitalize text-muted">
                  {new Date(`${dia}T00:00:00`).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                  })}
                </h3>
                <div className="divide-y divide-border">
                  {itens.map((item) => (
                    <div key={item.tipo + item.dados.id} className="flex items-center justify-between gap-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-20 shrink-0 text-sm font-medium">
                          {formatTime(item.inicio)}–{formatTime(item.fim)}
                        </div>
                        {item.tipo === "agendamento" ? (
                          <div>
                            <p className="text-sm font-medium">{item.dados.clienteNome}</p>
                            <p className="text-xs text-muted">
                              {nomeServico(item.dados.servicoId)} ·{" "}
                              {profissionais.find((p) => p.id === item.dados.profissionalId)?.nome}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted">
                            <Ban className="h-4 w-4" />
                            <span>
                              Bloqueio · {item.dados.motivo} ·{" "}
                              {profissionais.find((p) => p.id === item.dados.profissionalId)?.nome}
                            </span>
                          </div>
                        )}
                      </div>
                      {item.tipo === "agendamento" ? (
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{formatCurrency(item.dados.valor)}</span>
                          <Badge tone={statusAgendamentoTone(item.dados.status)}>
                            {statusAgendamentoLabel(item.dados.status)}
                          </Badge>
                        </div>
                      ) : (
                        <Badge tone="neutral">Bloqueado</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {porDia.length === 0 && (
            <div className="py-16 text-center text-muted">Nenhum item de agenda para este filtro.</div>
          )}
        </div>
      )}

      <NovoBloqueioModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        profissionais={profissionais}
        onCriado={() => {
          setModalAberto(false);
          carregar();
        }}
      />
    </div>
  );
}
