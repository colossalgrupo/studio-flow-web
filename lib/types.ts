// Domain types for the Studio Flow business dashboard.
// These mirror the shape the real Kotlin/Spring Boot API is expected to return.

export type Periodicidade = "semanal" | "mensal";

export type PlanoId = "standard" | "black" | "diamond";

export interface Plano {
  id: PlanoId;
  nome: string;
  precoMensal: number;
  taxaPlataforma: number; // percentual, ex.: 0.05 = 5%
  limiteProfissionais: number | null; // null = ilimitado
  destaque?: boolean;
  beneficios: string[];
}

export interface ContaBancaria {
  banco: string;
  agencia: string;
  conta: string;
  chavePix: string;
}

export interface ComissaoServico {
  servicoId: string;
  percentual: number; // percentual repassado ao profissional, ex.: 0.6 = 60%
}

export type StatusProfissional = "ativo" | "inativo";

export interface Profissional {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  avatarCor: string;
  especialidades: string[];
  contaBancaria: ContaBancaria;
  comissoes: ComissaoServico[];
  periodicidadeRepasse: Periodicidade;
  status: StatusProfissional;
  criadoEm: string;
}

export interface Servico {
  id: string;
  nome: string;
  categoria: string;
  duracaoMinutos: number;
  precoBase: number;
  profissionaisIds: string[];
  ativo: boolean;
}

export type StatusAgendamento = "confirmado" | "pendente" | "concluido" | "cancelado";

export interface Agendamento {
  id: string;
  clienteNome: string;
  profissionalId: string;
  servicoId: string;
  inicio: string; // ISO datetime
  fim: string; // ISO datetime
  status: StatusAgendamento;
  valor: number;
}

export interface BloqueioAgenda {
  id: string;
  profissionalId: string;
  inicio: string;
  fim: string;
  motivo: string;
}

export type StatusRepasse = "pendente" | "realizado";

export interface Repasse {
  id: string;
  profissionalId: string;
  periodoInicio: string;
  periodoFim: string;
  valorBruto: number;
  valorComissaoPlataforma: number;
  valorLiquido: number;
  status: StatusRepasse;
  dataPrevista: string;
  dataRealizado?: string;
}

export type TipoTransacao = "pix" | "cartao_credito" | "cartao_debito";

export interface Transacao {
  id: string;
  agendamentoId: string;
  data: string;
  tipo: TipoTransacao;
  clienteNome: string;
  profissionalId: string;
  servicoId: string;
  valorTotal: number;
  taxaPlataforma: number;
  valorEstabelecimento: number;
  valorProfissional: number;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  negocio: string;
}

export interface DashboardResumo {
  totalAgendamentosPeriodo: number;
  faturamentoPeriodo: number;
  repassesPendentes: number;
  profissionaisAtivos: number;
  variacaoFaturamento: number; // percentual vs período anterior
  faturamentoPorDia: { data: string; valor: number }[];
}
