// Serviço de estabelecimento.
// Chama a API real (/estabelecimentos) quando NEXT_PUBLIC_API_URL está configurada.
import { apiFetch } from "@/lib/api/client";
import type { CategoriaEstabelecimento, Endereco, Estabelecimento, TipoEmpresa } from "@/lib/types";

interface BackendEstabelecimento {
  id: string;
  nome: string;
  categoria: CategoriaEstabelecimento;
  endereco: Endereco;
  cpfCnpj: string;
  faturamentoMensal: number;
  asaasWalletId: string | null;
  asaasAccountStatus: string | null;
}

export interface NovoEstabelecimentoInput {
  nome: string;
  categoria: CategoriaEstabelecimento;
  endereco: Endereco;
  cpfCnpj: string;
  faturamentoMensal: number;
  dataNascimento?: string;
  companyType?: TipoEmpresa;
}

function paraEstabelecimento(e: BackendEstabelecimento): Estabelecimento {
  return {
    id: e.id,
    nome: e.nome,
    categoria: e.categoria,
    endereco: e.endereco,
    cpfCnpj: e.cpfCnpj,
    faturamentoMensal: e.faturamentoMensal,
  };
}

export async function criarEstabelecimento(input: NovoEstabelecimentoInput): Promise<Estabelecimento> {
  const criado = await apiFetch<BackendEstabelecimento>("/estabelecimentos", {
    method: "POST",
    body: input,
  });
  return paraEstabelecimento(criado);
}
