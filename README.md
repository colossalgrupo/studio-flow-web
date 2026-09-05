# Studio Flow — Painel Web

Painel de **gestão para o empreendedor/dono do negócio** (barbearia, estúdio de
pilates, personal trainer, salão de manicure etc.) do Studio Flow, um
marketplace de agendamento com pagamento integrado (Pix/cartão) para
profissionais de beleza e bem-estar.

Este repositório contém **apenas o painel web do dono do negócio**. O cliente
final usa o app mobile (repositório `studio-flow-android`); a API backend está
sendo construída em paralelo em Kotlin + Spring Boot + MongoDB (repositório
`studio-flow-backend`).

## Status do projeto

Esta etapa entrega a **fundação de UI do painel**: todas as telas navegáveis,
com dados de exemplo (mock) plausíveis, prontas para plugar na API real assim
que ela estiver disponível. Não há integração de pagamento nem persistência
real de dados ainda.

## Stack

- **Next.js 16 (App Router)** + **TypeScript**
- **Tailwind CSS v4**, com tema claro/escuro via `next-themes`
- Componentes de UI próprios, no estilo shadcn/ui (Tailwind + Radix-like),
  em `components/ui`
- Ícones: `lucide-react`

## Como rodar

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O login é uma
demonstração: qualquer e-mail válido e senha com 4+ caracteres funcionam.

Outros comandos úteis:

```bash
npm run build   # build de produção
npm run start   # roda o build de produção
npm run lint    # eslint
```

## Estrutura de pastas

```
app/
  page.tsx                  # redireciona para /login ou /dashboard
  login/                    # tela de login
  (dashboard)/              # grupo de rotas autenticadas (sidebar + topbar)
    layout.tsx               # guarda de rota + shell do painel
    dashboard/                # visão geral do negócio
    profissionais/            # cadastro e gestão de profissionais
    servicos/                  # catálogo de serviços
    agenda/                    # agenda, horários e bloqueios
    financeiro/                # extrato, repasses e split de pagamento
    plano/                      # plano de assinatura (Standard/Black/Diamond)

components/
  ui/                        # primitivos de UI (button, card, input, table…)
  dashboard-nav.tsx, avatar.tsx, stat-card.tsx, revenue-chart.tsx …

lib/
  types.ts                  # tipos de domínio (Profissional, Servico, ...)
  mock/                     # dados de exemplo (seed) usados pelos services
  auth/                     # contexto de autenticação (token mock em localStorage)
  status.ts, utils.ts       # labels/formatação compartilhadas

services/
  auth.ts, professionals.ts, services.ts, schedule.ts,
  financial.ts, plans.ts, dashboard.ts
```

### Camada `services/` — pronta para a API real

Toda chamada de dados do painel passa por `services/*.ts`. Hoje essas
funções retornam dados mockados (com uma latência simulada, para já exercitar
estados de carregamento), mas a assinatura de cada função já reflete o que se
espera de um endpoint real (`listarProfissionais`, `criarServico`,
`trocarPlano`, etc.). Quando a API do `studio-flow-backend` estiver pronta,
basta trocar a implementação interna de cada função por uma chamada
`fetch`/`axios`, sem alterar os componentes que as consomem.

### Autenticação

O fluxo de login (`app/login`) chama `services/auth.ts`, que conecta na API
real (Kotlin + Spring Boot) assim que `NEXT_PUBLIC_API_URL` é definida no
`.env.local`; sem essa variável, continua validando apenas o formato do
e-mail/senha e devolvendo um token mock, para o painel funcionar sozinho em
demonstração.

Endpoints usados (ver `.env.local.example` e `services/auth.ts`):

- `POST /auth/login` — `{ email, senha }` → `{ token, usuario }`
- `GET /auth/me` — valida o token e devolve o usuário atualizado
- `POST /auth/logout`

O token e o usuário são guardados em `localStorage` via `lib/auth/storage.ts`,
além de um cookie usado por `middleware.ts` para proteger as rotas no
servidor (redireciona para `/login?redirect=...` quando não há sessão). O
client HTTP central (`lib/api/client.ts`) anexa o header `Authorization` e
dispara um evento (`SESSAO_EXPIRADA_EVENT`) quando o backend responde 401, que
o `AuthProvider` escuta para encerrar a sessão automaticamente.

## Identidade visual

Paleta definida em `app/globals.css` (tokens Tailwind via `@theme inline`),
com suporte a modo claro/escuro:

| Papel   | Light     | Dark      |
| ------- | --------- | --------- |
| Accent (verde "salon green") | `#0F6B5C` | `#48C7A6` |
| Gold (destaque plano Diamond) | `#B8863A` | `#D9A857` |
| Rose (tag/categoria) | `#B15A46` | `#D98A73` |
| Fundo / Superfície | `#F5F6F3` / `#FFFFFF` | `#101513` / `#161D1A` |

## Deploy

O projeto está pronto para deploy gratuito na [Vercel](https://vercel.com/new),
plataforma nativa para Next.js (não requer `vercel.json` neste projeto — a
Vercel detecta e configura o build automaticamente).

1. Acesse [vercel.com/new](https://vercel.com/new) e importe este repositório
   (`colossalgrupo/studio-flow-web`).
2. O framework é detectado automaticamente como **Next.js** — não é preciso
   alterar comandos de build/start.
3. Em **Environment Variables**, copie as variáveis de `.env.local.example`
   e preencha os valores para o ambiente de produção (hoje nenhuma é
   obrigatória, já que o painel roda com dados mock).
4. Clique em **Deploy**. O plano gratuito (Hobby) da Vercel é suficiente para
   o volume deste projeto.

Cada push na branch `master` gera um novo deploy automaticamente.

## Planos de assinatura (mock)

| Plano    | Preço/mês  | Taxa da plataforma | Profissionais |
| -------- | ---------- | ------------------- | -------------- |
| Standard | R$ 49,90   | 5%                   | até 3           |
| Black    | R$ 89,90   | 2,5%                 | até 10          |
| Diamond  | R$ 189,90  | 1,5%                 | ilimitados      |
