"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import type { Periodicidade, Servico } from "@/lib/types";
import { criarProfissional } from "@/services/professionals";
import { listarServicos } from "@/services/services";
import { formatarCpfCnpj, validarCpfCnpj } from "@/lib/documento";

const CORES = ["#0F6B5C", "#B15A46", "#B8863A"];

export function NovoProfissionalModal({
  open,
  onClose,
  onCriado,
}: {
  open: boolean;
  onClose: () => void;
  onCriado: () => void;
}) {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [erroCpf, setErroCpf] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [especialidades, setEspecialidades] = useState("");
  const [banco, setBanco] = useState("");
  const [agencia, setAgencia] = useState("");
  const [conta, setConta] = useState("");
  const [chavePix, setChavePix] = useState("");
  const [comissao, setComissao] = useState(50);
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>([]);
  const [periodicidade, setPeriodicidade] = useState<Periodicidade>("semanal");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (open) listarServicos().then(setServicos);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setNome("");
      setCpf("");
      setErroCpf(null);
      setEmail("");
      setTelefone("");
      setEspecialidades("");
      setBanco("");
      setAgencia("");
      setConta("");
      setChavePix("");
      setComissao(50);
      setServicosSelecionados([]);
      setPeriodicidade("semanal");
    }
  }, [open]);

  function toggleServico(id: string) {
    setServicosSelecionados((atual) =>
      atual.includes(id) ? atual.filter((s) => s !== id) : [...atual, id],
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validarCpfCnpj(cpf)) {
      setErroCpf("CPF ou CNPJ inválido.");
      return;
    }
    setErroCpf(null);
    setSalvando(true);
    try {
      await criarProfissional({
        nome,
        cpf,
        email,
        telefone,
        avatarCor: CORES[Math.floor(Math.random() * CORES.length)],
        especialidades: especialidades
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        contaBancaria: { banco, agencia, conta, chavePix },
        comissoes: servicosSelecionados.map((servicoId) => ({
          servicoId,
          percentual: comissao / 100,
        })),
        periodicidadeRepasse: periodicidade,
        status: "ativo",
      });
      onCriado();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo profissional" className="max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome completo">
            <Input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Ana Paula Souza" />
          </Field>
          <Field label="CPF ou CNPJ" error={erroCpf ?? undefined}>
            <Input
              required
              value={cpf}
              onChange={(e) => {
                setCpf(formatarCpfCnpj(e.target.value));
                if (erroCpf) setErroCpf(null);
              }}
              maxLength={18}
              placeholder="000.000.000-00 ou 00.000.000/0001-00"
            />
          </Field>
          <Field label="E-mail">
            <Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Telefone">
            <Input required value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 90000-0000" />
          </Field>
        </div>

        <Field label="Especialidades (separadas por vírgula)">
          <Input
            required
            value={especialidades}
            onChange={(e) => setEspecialidades(e.target.value)}
            placeholder="Corte feminino, Coloração"
          />
        </Field>

        <div>
          <p className="mb-1.5 text-sm font-medium">Serviços vinculados e comissão</p>
          <div className="flex flex-wrap gap-2 rounded-lg border border-border p-3">
            {servicos.map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => toggleServico(s.id)}
                className={
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                  (servicosSelecionados.includes(s.id)
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-background text-foreground hover:bg-surface")
                }
              >
                {s.nome}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Comissão do profissional (%)">
            <Input
              type="number"
              min={0}
              max={100}
              required
              value={comissao}
              onChange={(e) => setComissao(Number(e.target.value))}
            />
          </Field>
          <Field label="Periodicidade de repasse">
            <Select value={periodicidade} onChange={(e) => setPeriodicidade(e.target.value as Periodicidade)}>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal</option>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Banco">
            <Input required value={banco} onChange={(e) => setBanco(e.target.value)} />
          </Field>
          <Field label="Agência">
            <Input required value={agencia} onChange={(e) => setAgencia(e.target.value)} />
          </Field>
          <Field label="Conta">
            <Input required value={conta} onChange={(e) => setConta(e.target.value)} />
          </Field>
          <Field label="Chave Pix">
            <Input required value={chavePix} onChange={(e) => setChavePix(e.target.value)} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando}>
            {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar profissional
          </Button>
        </div>
      </form>
    </Modal>
  );
}
