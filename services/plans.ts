// Serviço de plano de assinatura.
// Chama a API real (/planos, /estabelecimentos/me) quando NEXT_PUBLIC_API_URL
// está configurada; caso contrário usa dados mockados (ver README).
import { apiConfigurada, apiFetch } from "@/lib/api/client";
import { delay } from "@/lib/mock/delay";
import { PLANOS } from "@/lib/mock/seed";
import type { Plano, PlanoId } from "@/lib/types";

let planoAtualId: PlanoId = "black";

interface BackendPlano {
  id: string;
  nome: string;
  precoMensal: number;
  taxaPlataformaPct: number;
  limiteProfissionais: number | null;
}

/** Benefícios e destaque são conteúdo de marketing — o backend não modela isso, só o preço/taxa. */
const BENEFICIOS_POR_NOME: Record<string, { beneficios: string[]; destaque?: boolean }> = {
  Standard: {
    beneficios: [
      "Até 3 profissionais",
      "Agenda e catálogo de serviços",
      "Pagamentos via Pix e cartão",
      "Suporte por e-mail",
    ],
  },
  Black: {
    destaque: true,
    beneficios: [
      "Até 10 profissionais",
      "Relatórios financeiros avançados",
      "Repasses automáticos semanais",
      "Suporte prioritário",
    ],
  },
  Diamond: {
    beneficios: [
      "Profissionais ilimitados",
      "Menor taxa da plataforma",
      "Gerente de conta dedicado",
      "Repasses automáticos e personalizáveis",
    ],
  },
};

function paraPlano(p: BackendPlano): Plano {
  const marketing = BENEFICIOS_POR_NOME[p.nome];
  return {
    id: p.id,
    nome: p.nome,
    precoMensal: p.precoMensal,
    taxaPlataforma: p.taxaPlataformaPct / 100,
    limiteProfissionais: p.limiteProfissionais,
    destaque: marketing?.destaque,
    beneficios: marketing?.beneficios ?? [],
  };
}

export async function listarPlanos(): Promise<Plano[]> {
  if (apiConfigurada()) {
    const dados = await apiFetch<BackendPlano[]>("/planos", { autenticado: false });
    return dados.map(paraPlano);
  }
  return delay([...PLANOS]);
}

export async function obterPlanoAtual(): Promise<Plano> {
  if (apiConfigurada()) {
    const [estabelecimento, planos] = await Promise.all([
      apiFetch<{ planoId: string }>("/estabelecimentos/me"),
      listarPlanos(),
    ]);
    const atual = planos.find((p) => p.id === estabelecimento.planoId);
    if (!atual) throw new Error("Plano atual não encontrado.");
    return atual;
  }
  return delay(PLANOS.find((p) => p.id === planoAtualId)!);
}

export async function trocarPlano(id: PlanoId): Promise<Plano> {
  if (apiConfigurada()) {
    await apiFetch<unknown>("/estabelecimentos/me/plano", { method: "PUT", body: { planoId: id } });
    return obterPlanoAtual();
  }

  planoAtualId = id;
  return delay(PLANOS.find((p) => p.id === id)!, 600);
}
