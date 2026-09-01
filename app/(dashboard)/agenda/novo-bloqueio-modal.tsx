"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import type { Profissional } from "@/lib/types";
import { criarBloqueio } from "@/services/schedule";

export function NovoBloqueioModal({
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
  const [profissionalId, setProfissionalId] = useState("");
  const [data, setData] = useState("");
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [horaFim, setHoraFim] = useState("10:00");
  const [motivo, setMotivo] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (open) {
      setProfissionalId(profissionais[0]?.id ?? "");
      setData(new Date().toISOString().slice(0, 10));
      setHoraInicio("09:00");
      setHoraFim("10:00");
      setMotivo("");
    }
  }, [open, profissionais]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      await criarBloqueio({
        profissionalId,
        inicio: `${data}T${horaInicio}:00`,
        fim: `${data}T${horaFim}:00`,
        motivo,
      });
      onCriado();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Bloquear horário">
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Profissional">
          <Select required value={profissionalId} onChange={(e) => setProfissionalId(e.target.value)}>
            {profissionais.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Data">
          <Input type="date" required value={data} onChange={(e) => setData(e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Início">
            <Input type="time" required value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
          </Field>
          <Field label="Fim">
            <Input type="time" required value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
          </Field>
        </div>
        <Field label="Motivo">
          <Input required value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex.: Almoço, folga, curso" />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={salvando || !profissionalId}>
            {salvando && <Loader2 className="h-4 w-4 animate-spin" />}
            Bloquear
          </Button>
        </div>
      </form>
    </Modal>
  );
}
