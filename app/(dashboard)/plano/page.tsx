"use client";

import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { Plano, PlanoId } from "@/lib/types";
import { listarPlanos, obterPlanoAtual, trocarPlano } from "@/services/plans";

export default function PlanoPage() {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [planoAtual, setPlanoAtual] = useState<Plano | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [trocando, setTrocando] = useState<PlanoId | null>(null);

  function carregar() {
    setCarregando(true);
    Promise.all([listarPlanos(), obterPlanoAtual()]).then(([p, atual]) => {
      setPlanos(p);
      setPlanoAtual(atual);
      setCarregando(false);
    });
  }

  useEffect(carregar, []);

  async function onTrocarPlano(id: PlanoId) {
    setTrocando(id);
    const novo = await trocarPlano(id);
    setPlanoAtual(novo);
    setTrocando(null);
  }

  if (carregando || !planoAtual) {
    return (
      <div className="flex h-64 items-center justify-center text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Plano de assinatura" description="Compare e troque de plano quando quiser" />

      <Card className="mb-6 border-accent/40">
        <CardContent className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-muted">Seu plano atual</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-xl font-semibold">{planoAtual.nome}</h2>
              <Badge tone="accent">Ativo</Badge>
            </div>
            <p className="mt-1 text-sm text-muted">
              {formatCurrency(planoAtual.precoMensal)}/mês · taxa da plataforma de{" "}
              {formatPercent(planoAtual.taxaPlataforma)} ·{" "}
              {planoAtual.limiteProfissionais ? `até ${planoAtual.limiteProfissionais} profissionais` : "profissionais ilimitados"}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {planos.map((plano) => {
          const atual = plano.id === planoAtual.id;
          return (
            <Card
              key={plano.id}
              className={cn(
                "relative flex flex-col",
                plano.destaque && !atual && "border-gold ring-1 ring-gold",
                atual && "border-accent ring-1 ring-accent",
              )}
            >
              {plano.destaque && (
                <span className="absolute -top-3 left-5 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-gold-foreground">
                  Mais popular
                </span>
              )}
              <CardContent className="flex flex-1 flex-col">
                <h3 className="text-lg font-semibold">{plano.nome}</h3>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {formatCurrency(plano.precoMensal)}
                  <span className="text-sm font-normal text-muted">/mês</span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  Taxa da plataforma: <span className="font-medium text-foreground">{formatPercent(plano.taxaPlataforma)}</span>
                </p>
                <p className="text-sm text-muted">
                  {plano.limiteProfissionais ? `Até ${plano.limiteProfissionais} profissionais` : "Profissionais ilimitados"}
                </p>

                <ul className="mt-4 flex-1 space-y-2">
                  {plano.beneficios.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="mt-6 w-full"
                  variant={atual ? "outline" : plano.destaque ? "secondary" : "primary"}
                  disabled={atual || trocando === plano.id}
                  onClick={() => onTrocarPlano(plano.id)}
                >
                  {trocando === plano.id && <Loader2 className="h-4 w-4 animate-spin" />}
                  {atual ? "Plano atual" : "Trocar para este plano"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
