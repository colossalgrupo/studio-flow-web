import type {
  Agendamento,
  BloqueioAgenda,
  Plano,
  Profissional,
  Repasse,
  Servico,
  Transacao,
  Usuario,
} from "@/lib/types";

export const PLANOS: Plano[] = [
  {
    id: "standard",
    nome: "Standard",
    precoMensal: 49.9,
    taxaPlataforma: 0.05,
    limiteProfissionais: 3,
    beneficios: [
      "Até 3 profissionais",
      "Agenda e catálogo de serviços",
      "Pagamentos via Pix e cartão",
      "Suporte por e-mail",
    ],
  },
  {
    id: "black",
    nome: "Black",
    precoMensal: 89.9,
    taxaPlataforma: 0.025,
    limiteProfissionais: 10,
    destaque: true,
    beneficios: [
      "Até 10 profissionais",
      "Relatórios financeiros avançados",
      "Repasses automáticos semanais",
      "Suporte prioritário",
    ],
  },
  {
    id: "diamond",
    nome: "Diamond",
    precoMensal: 189.9,
    taxaPlataforma: 0.015,
    limiteProfissionais: null,
    beneficios: [
      "Profissionais ilimitados",
      "Menor taxa da plataforma",
      "Gerente de conta dedicado",
      "Repasses automáticos e personalizáveis",
    ],
  },
];

export const USUARIO_ATUAL: Usuario = {
  id: "u1",
  nome: "Camila Duarte",
  email: "camila@estudiobellamente.com.br",
  negocio: "Estúdio Bella Mente",
};

export const PROFISSIONAIS: Profissional[] = [
  {
    id: "p1",
    nome: "Juliana Ramos",
    cpf: "123.456.789-00",
    email: "juliana.ramos@studioflow.app",
    telefone: "(11) 98221-3345",
    avatarCor: "#0F6B5C",
    especialidades: ["Corte feminino", "Coloração", "Escova"],
    contaBancaria: {
      banco: "Nubank",
      agencia: "0001",
      conta: "12345678-9",
      chavePix: "juliana.ramos@studioflow.app",
    },
    comissoes: [
      { servicoId: "s1", percentual: 0.6 },
      { servicoId: "s2", percentual: 0.55 },
    ],
    periodicidadeRepasse: "semanal",
    status: "ativo",
    criadoEm: "2025-11-02",
  },
  {
    id: "p2",
    nome: "Marcos Vinícius Oliveira",
    cpf: "987.654.321-00",
    email: "marcos.oliveira@studioflow.app",
    telefone: "(11) 97711-2298",
    avatarCor: "#B15A46",
    especialidades: ["Barba", "Corte masculino", "Sobrancelha"],
    contaBancaria: {
      banco: "Banco do Brasil",
      agencia: "3391-2",
      conta: "55214-3",
      chavePix: "(11) 97711-2298",
    },
    comissoes: [
      { servicoId: "s3", percentual: 0.5 },
      { servicoId: "s4", percentual: 0.5 },
    ],
    periodicidadeRepasse: "mensal",
    status: "ativo",
    criadoEm: "2025-11-10",
  },
  {
    id: "p3",
    nome: "Beatriz Nogueira",
    cpf: "456.789.123-00",
    email: "beatriz.nogueira@studioflow.app",
    telefone: "(11) 96654-8821",
    avatarCor: "#B8863A",
    especialidades: ["Pilates solo", "Pilates aparelhos", "Alongamento"],
    contaBancaria: {
      banco: "Itaú",
      agencia: "0921",
      conta: "88452-1",
      chavePix: "456.789.123-00",
    },
    comissoes: [{ servicoId: "s5", percentual: 0.65 }],
    periodicidadeRepasse: "semanal",
    status: "ativo",
    criadoEm: "2025-12-01",
  },
  {
    id: "p4",
    nome: "Rafael Costa",
    cpf: "321.654.987-00",
    email: "rafael.costa@studioflow.app",
    telefone: "(11) 95521-7743",
    avatarCor: "#0F6B5C",
    especialidades: ["Personal trainer", "Avaliação física"],
    contaBancaria: {
      banco: "Caixa",
      agencia: "1234",
      conta: "00099887-4",
      chavePix: "rafael.costa@studioflow.app",
    },
    comissoes: [{ servicoId: "s6", percentual: 0.7 }],
    periodicidadeRepasse: "mensal",
    status: "ativo",
    criadoEm: "2026-01-15",
  },
  {
    id: "p5",
    nome: "Larissa Fontoura",
    cpf: "654.321.987-00",
    email: "larissa.fontoura@studioflow.app",
    telefone: "(11) 94432-6612",
    avatarCor: "#B15A46",
    especialidades: ["Manicure", "Pedicure", "Nail art"],
    contaBancaria: {
      banco: "Nubank",
      agencia: "0001",
      conta: "44221-0",
      chavePix: "654.321.987-00",
    },
    comissoes: [{ servicoId: "s7", percentual: 0.55 }],
    periodicidadeRepasse: "semanal",
    status: "inativo",
    criadoEm: "2025-10-20",
  },
];

export const SERVICOS: Servico[] = [
  {
    id: "s1",
    nome: "Corte feminino",
    categoria: "Cabelo",
    duracaoMinutos: 60,
    precoBase: 120,
    profissionaisIds: ["p1"],
    ativo: true,
  },
  {
    id: "s2",
    nome: "Coloração completa",
    categoria: "Cabelo",
    duracaoMinutos: 120,
    precoBase: 280,
    profissionaisIds: ["p1"],
    ativo: true,
  },
  {
    id: "s3",
    nome: "Corte masculino + barba",
    categoria: "Barbearia",
    duracaoMinutos: 45,
    precoBase: 80,
    profissionaisIds: ["p2"],
    ativo: true,
  },
  {
    id: "s4",
    nome: "Sobrancelha masculina",
    categoria: "Barbearia",
    duracaoMinutos: 20,
    precoBase: 35,
    profissionaisIds: ["p2"],
    ativo: true,
  },
  {
    id: "s5",
    nome: "Pilates aparelhos (aula avulsa)",
    categoria: "Bem-estar",
    duracaoMinutos: 50,
    precoBase: 95,
    profissionaisIds: ["p3"],
    ativo: true,
  },
  {
    id: "s6",
    nome: "Personal training (sessão)",
    categoria: "Bem-estar",
    duracaoMinutos: 60,
    precoBase: 110,
    profissionaisIds: ["p4"],
    ativo: true,
  },
  {
    id: "s7",
    nome: "Manicure + pedicure",
    categoria: "Estética",
    duracaoMinutos: 75,
    precoBase: 70,
    profissionaisIds: ["p5"],
    ativo: false,
  },
];

function iso(dateStr: string, hour: number, minute = 0) {
  return `${dateStr}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
}

const HOJE = "2026-09-01";
const D1 = "2026-09-02";
const D2 = "2026-09-03";
const D_1 = "2026-08-31";

export const AGENDAMENTOS: Agendamento[] = [
  { id: "a1", clienteNome: "Fernanda Lima", profissionalId: "p1", servicoId: "s1", inicio: iso(HOJE, 9), fim: iso(HOJE, 10), status: "confirmado", valor: 120 },
  { id: "a2", clienteNome: "Patrícia Souza", profissionalId: "p1", servicoId: "s2", inicio: iso(HOJE, 10, 30), fim: iso(HOJE, 12, 30), status: "confirmado", valor: 280 },
  { id: "a3", clienteNome: "Diego Martins", profissionalId: "p2", servicoId: "s3", inicio: iso(HOJE, 9, 30), fim: iso(HOJE, 10, 15), status: "concluido", valor: 80 },
  { id: "a4", clienteNome: "Otávio Ferreira", profissionalId: "p2", servicoId: "s4", inicio: iso(HOJE, 11), fim: iso(HOJE, 11, 20), status: "pendente", valor: 35 },
  { id: "a5", clienteNome: "Renata Alves", profissionalId: "p3", servicoId: "s5", inicio: iso(HOJE, 8), fim: iso(HOJE, 8, 50), status: "concluido", valor: 95 },
  { id: "a6", clienteNome: "Bruno Tavares", profissionalId: "p4", servicoId: "s6", inicio: iso(HOJE, 7), fim: iso(HOJE, 8), status: "concluido", valor: 110 },
  { id: "a7", clienteNome: "Camila Rocha", profissionalId: "p1", servicoId: "s1", inicio: iso(D1, 14), fim: iso(D1, 15), status: "confirmado", valor: 120 },
  { id: "a8", clienteNome: "Igor Sampaio", profissionalId: "p2", servicoId: "s3", inicio: iso(D1, 16), fim: iso(D1, 16, 45), status: "confirmado", valor: 80 },
  { id: "a9", clienteNome: "Sofia Nunes", profissionalId: "p3", servicoId: "s5", inicio: iso(D1, 9), fim: iso(D1, 9, 50), status: "pendente", valor: 95 },
  { id: "a10", clienteNome: "Helena Prado", profissionalId: "p1", servicoId: "s2", inicio: iso(D2, 10), fim: iso(D2, 12), status: "confirmado", valor: 280 },
  { id: "a11", clienteNome: "André Barbosa", profissionalId: "p4", servicoId: "s6", inicio: iso(D2, 18), fim: iso(D2, 19), status: "confirmado", valor: 110 },
  { id: "a12", clienteNome: "Vitória Cardoso", profissionalId: "p2", servicoId: "s4", inicio: iso(D_1, 15), fim: iso(D_1, 15, 20), status: "cancelado", valor: 35 },
  { id: "a13", clienteNome: "Lucas Meireles", profissionalId: "p1", servicoId: "s1", inicio: iso(D_1, 9), fim: iso(D_1, 10), status: "concluido", valor: 120 },
  { id: "a14", clienteNome: "Marina Teixeira", profissionalId: "p3", servicoId: "s5", inicio: iso(D_1, 11), fim: iso(D_1, 11, 50), status: "concluido", valor: 95 },
];

export const BLOQUEIOS: BloqueioAgenda[] = [
  { id: "b1", profissionalId: "p1", inicio: iso(HOJE, 13), fim: iso(HOJE, 14), motivo: "Almoço" },
  { id: "b2", profissionalId: "p2", inicio: iso(D1, 12), fim: iso(D1, 13), motivo: "Almoço" },
  { id: "b3", profissionalId: "p3", inicio: iso(D2, 12), fim: iso(D2, 15), motivo: "Consulta médica" },
];

function gerarTransacoes(): Transacao[] {
  const taxaPlataforma = 0.025; // plano Black
  return AGENDAMENTOS.filter((a) => a.status === "concluido" || a.status === "confirmado").map((a, idx) => {
    const profissional = PROFISSIONAIS.find((p) => p.id === a.profissionalId)!;
    const comissao = profissional.comissoes.find((c) => c.servicoId === a.servicoId)?.percentual ?? 0.5;
    const valorPlataforma = round2(a.valor * taxaPlataforma);
    const valorProfissional = round2((a.valor - valorPlataforma) * comissao);
    const valorEstabelecimento = round2(a.valor - valorPlataforma - valorProfissional);
    const tipos: Transacao["tipo"][] = ["pix", "cartao_credito", "cartao_debito"];
    return {
      id: `t${idx + 1}`,
      agendamentoId: a.id,
      data: a.inicio,
      tipo: tipos[idx % tipos.length],
      clienteNome: a.clienteNome,
      profissionalId: a.profissionalId,
      servicoId: a.servicoId,
      valorTotal: a.valor,
      taxaPlataforma: valorPlataforma,
      valorEstabelecimento,
      valorProfissional,
    };
  });
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export const TRANSACOES: Transacao[] = gerarTransacoes();

export const REPASSES: Repasse[] = [
  {
    id: "r1",
    profissionalId: "p1",
    periodoInicio: "2026-08-24",
    periodoFim: "2026-08-30",
    valorBruto: 1840,
    valorComissaoPlataforma: 46,
    valorLiquido: 1076.4,
    status: "realizado",
    dataPrevista: "2026-08-31",
    dataRealizado: "2026-08-31",
  },
  {
    id: "r2",
    profissionalId: "p1",
    periodoInicio: "2026-08-31",
    periodoFim: "2026-09-06",
    valorBruto: 1210,
    valorComissaoPlataforma: 30.25,
    valorLiquido: 707.84,
    status: "pendente",
    dataPrevista: "2026-09-07",
  },
  {
    id: "r3",
    profissionalId: "p2",
    periodoInicio: "2026-08-01",
    periodoFim: "2026-08-31",
    valorBruto: 3120,
    valorComissaoPlataforma: 78,
    valorLiquido: 1521,
    status: "realizado",
    dataPrevista: "2026-08-31",
    dataRealizado: "2026-09-01",
  },
  {
    id: "r4",
    profissionalId: "p3",
    periodoInicio: "2026-08-24",
    periodoFim: "2026-08-30",
    valorBruto: 980,
    valorComissaoPlataforma: 24.5,
    valorLiquido: 620.58,
    status: "pendente",
    dataPrevista: "2026-09-07",
  },
  {
    id: "r5",
    profissionalId: "p4",
    periodoInicio: "2026-08-01",
    periodoFim: "2026-08-31",
    valorBruto: 1650,
    valorComissaoPlataforma: 41.25,
    valorLiquido: 1125.53,
    status: "pendente",
    dataPrevista: "2026-09-05",
  },
];
