// Serviço de profissionais.
// Chama a API real (/profissionais) quando NEXT_PUBLIC_API_URL está configurada;
// caso contrário usa dados mockados (ver README).
import { apiConfigurada, apiFetch } from "@/lib/api/client";
import { delay } from "@/lib/mock/delay";
import { PROFISSIONAIS } from "@/lib/mock/seed";
import type { ContaBancaria, Periodicidade, Profissional } from "@/lib/types";

let profissionais = [...PROFISSIONAIS];

const CORES_AVATAR = ["#0F6B5C", "#B15A46", "#B8863A", "#3B5FA0", "#7A4FA0", "#2E7D64"];

/** O backend não guarda cor de avatar — deriva uma cor estável a partir do id. */
function corAvatar(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return CORES_AVATAR[hash % CORES_AVATAR.length];
}

/** ObjectId do Mongo codifica o instante de criação nos 4 primeiros bytes. */
function criadoEmDoId(id: string): string {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) return new Date().toISOString().slice(0, 10);
  const segundosEpoch = parseInt(id.slice(0, 8), 16);
  return new Date(segundosEpoch * 1000).toISOString().slice(0, 10);
}

interface BackendContaBancaria {
  chavePix: string;
  banco: string;
  agencia: string;
  conta: string;
}

interface BackendProfissional {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  especialidades: string[];
  percentualComissao: number;
  periodicidadeRepasse: "SEMANAL" | "MENSAL";
  contaBancaria: BackendContaBancaria;
  ativo: boolean;
}

function paraContaBancaria(c: BackendContaBancaria): ContaBancaria {
  return { banco: c.banco, agencia: c.agencia, conta: c.conta, chavePix: c.chavePix };
}

function paraPeriodicidade(p: "SEMANAL" | "MENSAL"): Periodicidade {
  return p === "SEMANAL" ? "semanal" : "mensal";
}

function paraPeriodicidadeBackend(p: Periodicidade): "SEMANAL" | "MENSAL" {
  return p === "semanal" ? "SEMANAL" : "MENSAL";
}

function paraProfissional(p: BackendProfissional): Profissional {
  return {
    id: p.id,
    nome: p.nome,
    cpf: p.cpf,
    email: p.email,
    telefone: p.telefone,
    avatarCor: corAvatar(p.id),
    especialidades: p.especialidades,
    contaBancaria: paraContaBancaria(p.contaBancaria),
    // O backend guarda uma comissão única por profissional (não por serviço).
    comissoes: [],
    periodicidadeRepasse: paraPeriodicidade(p.periodicidadeRepasse),
    status: p.ativo ? "ativo" : "inativo",
    criadoEm: criadoEmDoId(p.id),
  };
}

function paraRequest(input: NovoProfissionalInput | Profissional) {
  const percentual = input.comissoes[0]?.percentual ?? 0;
  return {
    nome: input.nome,
    cpf: input.cpf,
    email: input.email,
    telefone: input.telefone,
    especialidades: input.especialidades,
    percentualComissao: percentual * 100,
    periodicidadeRepasse: paraPeriodicidadeBackend(input.periodicidadeRepasse),
    contaBancaria: input.contaBancaria,
    ativo: input.status === "ativo",
  };
}

export async function listarProfissionais(): Promise<Profissional[]> {
  if (apiConfigurada()) {
    const dados = await apiFetch<BackendProfissional[]>("/profissionais/me");
    return dados.map(paraProfissional);
  }
  return delay([...profissionais]);
}

export async function obterProfissional(id: string): Promise<Profissional | undefined> {
  if (apiConfigurada()) {
    const p = await apiFetch<BackendProfissional>(`/profissionais/${id}`);
    return paraProfissional(p);
  }
  return delay(profissionais.find((p) => p.id === id));
}

export type NovoProfissionalInput = Omit<Profissional, "id" | "criadoEm">;

export async function criarProfissional(input: NovoProfissionalInput): Promise<Profissional> {
  if (apiConfigurada()) {
    const criado = await apiFetch<BackendProfissional>("/profissionais", {
      method: "POST",
      body: paraRequest(input),
    });
    return paraProfissional(criado);
  }

  const novo: Profissional = {
    ...input,
    id: `p${Date.now()}`,
    criadoEm: new Date().toISOString().slice(0, 10),
  };
  profissionais = [novo, ...profissionais];
  return delay(novo);
}

export async function atualizarProfissional(
  id: string,
  patch: Partial<Profissional>,
): Promise<Profissional> {
  if (apiConfigurada()) {
    const atual = await obterProfissional(id);
    if (!atual) throw new Error("Profissional não encontrado.");
    const mesclado: Profissional = { ...atual, ...patch };
    const atualizado = await apiFetch<BackendProfissional>(`/profissionais/${id}`, {
      method: "PUT",
      body: paraRequest(mesclado),
    });
    return paraProfissional(atualizado);
  }

  profissionais = profissionais.map((p) => (p.id === id ? { ...p, ...patch } : p));
  const atualizado = profissionais.find((p) => p.id === id)!;
  return delay(atualizado);
}

export async function removerProfissional(id: string): Promise<void> {
  if (apiConfigurada()) {
    await apiFetch<void>(`/profissionais/${id}`, { method: "DELETE" });
    return;
  }
  profissionais = profissionais.filter((p) => p.id !== id);
  return delay(undefined);
}
