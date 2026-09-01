"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import type { Profissional } from "@/lib/types";
import { criarServico } from "@/services/services";

export function NovoServicoModal({
  open,
  onClose,
  onCriado,
  profissionais,
}: {
  open: boolean;
  onClose: () => void;
  onCriado: () => void;
  profissionais: Profissional[];
}) {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [duracao, setDuracao] = useState(60);
  const [preco, setPreco] = useState(100);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!open) {
      setNome("");
      setCategoria("");
      setDuracao(60);
      setPreco(100);
      setSelecionados([]);
    }
  }, [open]);

  function toggle(id: string) {
    setSelecionados((atual) => (atual.includes(id) ? atual.filter((s) => s !== id) : [...atual, id]));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await criarServico({
        nome,
        categoria,
        duracaoMinutos: duracao,
        precoBase: preco,
        profissionaisIds: selecionados,
        ativo: true,
      });
      onCriado();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Novo serviço">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Nome do serviço">
          <Input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Corte + escova" />
        </Field>
        <Field label="Categoria">
          <Input required value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ex.: Cabelo" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Duração (min)">
            <Input type="number" min={5} required value={duracao} onChange={(e) => setDuracao(Number(e.target.value))} />
          </Field>
          <Field label="Preço-base (R$)">
            <Input type="number" min={0} step="0.01" required value={preco} onChange={(e) => setPreco(Number(e.target.value))} />
          </Field>
        </div>

        <div>
          <p className="mb-1.5 text-sm font-medium">Profissionais vinculados</p>
          <div className="flex flex-wrap gap-2 rounded-lg border border-border p-3">
            {profissionais.map((p) => (
              <button
                type="button"
                key={p.id}
                onClick={() => toggle(p.id)}
                className={
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                  (selecionados.includes(p.id)
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-background text-foreground hover:bg-surface")
                }
              >
                {p.nome}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando}>
            {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
            Salvar serviço
          </Button>
        </div>
      </form>
    </Modal>
  );
}
