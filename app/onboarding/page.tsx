"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/context";
import { formatarCpfCnpj, validarCpfCnpj } from "@/lib/documento";
import { criarEstabelecimento } from "@/services/establishment";
import { listarPlanos, trocarPlano } from "@/services/plans";
import type { CategoriaEstabelecimento, Plano, TipoEmpresa } from "@/lib/types";

const CATEGORIAS: { value: CategoriaEstabelecimento; label: string }[] = [
  { value: "BARBEARIA", label: "Barbearia" },
  { value: "MANICURE", label: "Manicure" },
  { value: "PODOLOGIA", label: "Podologia" },
  { value: "MASSOTERAPIA", label: "Massoterapia" },
  { value: "TRANCISTA", label: "Trancista" },
  { value: "PERSONAL_TRAINER", label: "Personal trainer" },
  { value: "ESTUDIO_PILATES", label: "Estúdio de pilates" },
  { value: "OUTRO", label: "Outro" },
];

const TIPOS_EMPRESA: { value: TipoEmpresa; label: string }[] = [
  { value: "MEI", label: "MEI (Microempreendedor Individual)" },
  { value: "INDIVIDUAL", label: "Empresário individual" },
  { value: "LIMITED", label: "Sociedade limitada" },
  { value: "ASSOCIATION", label: "Associação/Cooperativa" },
];

const UFS = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB",
  "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

export default function OnboardingPage() {
  const { usuario, carregando, autenticado, atualizarUsuario } = useAuth();
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState<CategoriaEstabelecimento>("BARBEARIA");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("SP");
  const [cep, setCep] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [erroCpfCnpj, setErroCpfCnpj] = useState<string | null>(null);
  const [faturamentoMensal, setFaturamentoMensal] = useState(0);
  const [dataNascimento, setDataNascimento] = useState("");
  const [companyType, setCompanyType] = useState<TipoEmpresa>("MEI");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [planoSelecionadoId, setPlanoSelecionadoId] = useState<string>("");

  const documento = cpfCnpj.replace(/\D/g, "");
  const ehCnpj = documento.length > 11;

  useEffect(() => {
    if (!carregando && !autenticado) router.replace("/login");
  }, [carregando, autenticado, router]);

  useEffect(() => {
    if (!carregando && usuario?.negocio) router.replace("/dashboard");
  }, [carregando, usuario, router]);

  useEffect(() => {
    listarPlanos().then((lista) => {
      setPlanos(lista);
      const preferido = usuario?.planoPreferido
        ? lista.find((p) => p.nome.toLowerCase() === usuario.planoPreferido)
        : undefined;
      setPlanoSelecionadoId((preferido ?? lista.find((p) => p.nome === "Standard") ?? lista[0])?.id ?? "");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.planoPreferido]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validarCpfCnpj(cpfCnpj)) {
      setErroCpfCnpj("CPF ou CNPJ inválido.");
      return;
    }
    setErroCpfCnpj(null);
    setErro(null);
    setEnviando(true);
    try {
      await criarEstabelecimento({
        nome,
        categoria,
        endereco: { logradouro, numero, bairro, cidade, estado, cep },
        cpfCnpj,
        faturamentoMensal,
        dataNascimento: ehCnpj ? undefined : dataNascimento,
        companyType: ehCnpj ? companyType : undefined,
      });
      // O estabelecimento sempre nasce no plano Standard — só troca se a pessoa escolheu outro.
      const planoEscolhido = planos.find((p) => p.id === planoSelecionadoId);
      if (planoEscolhido && planoEscolhido.nome !== "Standard") {
        await trocarPlano(planoEscolhido.id);
      }
      await atualizarUsuario();
      router.replace("/dashboard");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível criar o estabelecimento.");
    } finally {
      setEnviando(false);
    }
  }

  if (carregando || !autenticado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Carregando…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-lg font-bold text-accent-foreground">
            SF
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Vamos cadastrar seu negócio</h1>
          <p className="mt-1 text-sm text-muted">
            Só falta isso pra você começar a usar o Studio Schedulle. Leva menos de 2 minutos.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome do estabelecimento">
              <Input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Studio Ana Paula" />
            </Field>
            <Field label="Categoria">
              <Select value={categoria} onChange={(e) => setCategoria(e.target.value as CategoriaEstabelecimento)}>
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div>
            <p className="mb-1.5 text-sm font-medium text-foreground">Plano</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {planos.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPlanoSelecionadoId(p.id)}
                  className={cn(
                    "rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-colors",
                    planoSelecionadoId === p.id
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-background text-foreground hover:bg-surface",
                  )}
                >
                  {p.nome}
                  <span className="mt-0.5 block text-xs font-normal text-muted">
                    R$ {p.precoMensal.toFixed(2).replace(".", ",")}/mês
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="pt-2 text-sm font-medium text-foreground">Endereço</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="CEP">
              <Input required value={cep} onChange={(e) => setCep(e.target.value)} placeholder="00000-000" maxLength={9} />
            </Field>
            <Field label="Número">
              <Input required value={numero} onChange={(e) => setNumero(e.target.value)} />
            </Field>
            <Field label="Bairro">
              <Input required value={bairro} onChange={(e) => setBairro(e.target.value)} />
            </Field>
          </div>
          <Field label="Logradouro">
            <Input
              required
              value={logradouro}
              onChange={(e) => setLogradouro(e.target.value)}
              placeholder="Rua, avenida..."
            />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Cidade">
              <Input required value={cidade} onChange={(e) => setCidade(e.target.value)} />
            </Field>
            <Field label="Estado">
              <Select value={estado} onChange={(e) => setEstado(e.target.value)}>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <p className="pt-2 text-sm font-medium text-foreground">Dados de pagamento</p>
          <p className="-mt-2 text-xs text-muted">
            Usados só pra abrir a conta que recebe automaticamente a parte do estabelecimento em cada pagamento.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="CPF ou CNPJ" error={erroCpfCnpj ?? undefined}>
              <Input
                required
                value={cpfCnpj}
                onChange={(e) => {
                  setCpfCnpj(formatarCpfCnpj(e.target.value));
                  if (erroCpfCnpj) setErroCpfCnpj(null);
                }}
                maxLength={18}
                placeholder="000.000.000-00 ou 00.000.000/0001-00"
              />
            </Field>
            <Field label="Faturamento mensal (R$)">
              <Input
                required
                type="number"
                min={0.01}
                step="0.01"
                value={faturamentoMensal || ""}
                onChange={(e) => setFaturamentoMensal(Number(e.target.value))}
                placeholder="Ex.: 8000"
              />
            </Field>
          </div>

          {ehCnpj ? (
            <Field label="Tipo de empresa">
              <Select value={companyType} onChange={(e) => setCompanyType(e.target.value as TipoEmpresa)}>
                {TIPOS_EMPRESA.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
          ) : (
            <Field label="Data de nascimento">
              <Input required type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
            </Field>
          )}

          {erro && (
            <div className="flex items-start gap-2 rounded-lg bg-danger/10 p-3 text-sm text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={enviando}>
            {enviando && <Loader2 className="h-4 w-4 animate-spin" />}
            Criar estabelecimento
          </Button>
        </form>
      </div>
    </div>
  );
}
