// Serviço financeiro (extrato, repasses, split por transação).
// Chama a API real (/financeiro/*) quando NEXT_PUBLIC_API_URL está configurada;
// caso contrário usa dados mockados (ver README).
import { apiConfigurada, apiFetch } from "@/lib/api/client";
import { delay } from "@/lib/mock/delay";
import { REPASSES, TRANSACOES } from "@/lib/mock/seed";
import type { Repasse, StatusRepasse, Transacao, TipoTransacao } from "@/lib/types";

let repasses = [...REPASSES];

type BackendMetodoPagamento = "PIX" | "CARTAO";
type BackendStatusRepasse = "PENDENTE" | "REALIZADO";

interface BackendTransacao {
  id: string;
  agendamentoId: string;
  data: string;
  metodo: BackendMetodoPagamento;
  clienteNome: string;
  profissionalId: string;
  profissionalNome: string;
  servicoId: string;
  servicoNome: string;
  valorTotal: number;
  taxaPlataforma: number;
  valorEstabelecimento: number;
  valorProfissional: number;
}

interface BackendRepasse {
  id: string;
  profissionalId: string;
  profissionalNome: string;
  periodoInicio: string;
  periodoFim: string;
  valorBruto: number;
  valorComissaoPlataforma: number;
  valorLiquido: number;
  status: BackendStatusRepasse;
  dataPrevista: string;
  dataRealizado: string | null;
}

const METODO_PARA_TIPO: Record<BackendMetodoPagamento, TipoTransacao> = {
  PIX: "pix",
  CARTAO: "cartao_credito",
};

const STATUS_REPASSE_PARA_FRONT: Record<BackendStatusRepasse, StatusRepasse> = {
  PENDENTE: "pendente",
  REALIZADO: "realizado",
};

function paraTransacao(t: BackendTransacao): Transacao {
  return {
    id: t.id,
    agendamentoId: t.agendamentoId,
    data: t.data,
    tipo: METODO_PARA_TIPO[t.metodo],
    clienteNome: t.clienteNome,
    profissionalId: t.profissionalId,
    servicoId: t.servicoId,
    valorTotal: t.valorTotal,
    taxaPlataforma: t.taxaPlataforma,
    valorEstabelecimento: t.valorEstabelecimento,
    valorProfissional: t.valorProfissional,
  };
}

function paraRepasse(r: BackendRepasse): Repasse {
  return {
    id: r.id,
    profissionalId: r.profissionalId,
    periodoInicio: r.periodoInicio,
    periodoFim: r.periodoFim,
    valorBruto: r.valorBruto,
    valorComissaoPlataforma: r.valorComissaoPlataforma,
    valorLiquido: r.valorLiquido,
    status: STATUS_REPASSE_PARA_FRONT[r.status],
    dataPrevista: r.dataPrevista,
    dataRealizado: r.dataRealizado ?? undefined,
  };
}

export async function listarTransacoes(): Promise<Transacao[]> {
  if (apiConfigurada()) {
    const dados = await apiFetch<BackendTransacao[]>("/financeiro/transacoes");
    return dados.map(paraTransacao);
  }
  return delay([...TRANSACOES].sort((a, b) => b.data.localeCompare(a.data)));
}

export async function listarRepasses(): Promise<Repasse[]> {
  if (apiConfigurada()) {
    const dados = await apiFetch<BackendRepasse[]>("/financeiro/repasses");
    return dados.map(paraRepasse).sort((a, b) => b.periodoFim.localeCompare(a.periodoFim));
  }
  return delay([...repasses].sort((a, b) => b.periodoFim.localeCompare(a.periodoFim)));
}

export async function marcarRepasseComoRealizado(id: string): Promise<Repasse> {
  if (apiConfigurada()) {
    const atuais = await listarRepasses();
    const alvo = atuais.find((r) => r.id === id);
    if (!alvo) throw new Error("Repasse não encontrado.");
    const atualizado = await apiFetch<BackendRepasse>(
      `/financeiro/repasses/profissional/${alvo.profissionalId}/marcar-realizado`,
      { method: "POST" },
    );
    return paraRepasse(atualizado);
  }

  repasses = repasses.map((r) =>
    r.id === id
      ? { ...r, status: "realizado" as const, dataRealizado: new Date().toISOString().slice(0, 10) }
      : r,
  );
  return delay(repasses.find((r) => r.id === id)!);
}
