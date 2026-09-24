// Domain types for the Studio Flow business dashboard.
// These mirror the shape the real Kotlin/Spring Boot API is expected to return.

export type Periodicidade = "semanal" | "mensal";

// Id real do plano no banco (Mongo ObjectId) — não é um enum fixo.
export type PlanoId = string;

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

export type CategoriaEstabelecimento =
  | "BARBEARIA"
  | "MANICURE"
  | "PODOLOGIA"
  | "MASSOTERAPIA"
  | "TRANCISTA"
  | "PERSONAL_TRAINER"
  | "ESTUDIO_PILATES"
  | "OUTRO";

export interface Endereco {
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

/** Tipo de empresa exigido pela Asaas ao abrir subconta com CNPJ. */
export type TipoEmpresa = "MEI" | "LIMITED" | "INDIVIDUAL" | "ASSOCIATION";

export interface Estabelecimento {
  id: string;
  nome: string;
  categoria: CategoriaEstabelecimento;
  endereco: Endereco;
  cpfCnpj: string;
  faturamentoMensal: number;
  dataNascimento?: string; // yyyy-MM-dd, só quando cpfCnpj é CPF
  companyType?: TipoEmpresa; // só quando cpfCnpj é CNPJ
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
  /** Exigidos pelo backend pra abrir a subconta de pagamento (split) do profissional. */
  dataNascimento: string; // yyyy-MM-dd
  faturamentoMensal: number;
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
