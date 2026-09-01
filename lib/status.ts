import type { StatusAgendamento, StatusProfissional, StatusRepasse } from "@/lib/types";

type Tone = "neutral" | "accent" | "gold" | "rose" | "success" | "warning" | "danger";

export function statusAgendamentoLabel(status: StatusAgendamento): string {
  return {
    confirmado: "Confirmado",
    pendente: "Pendente",
    concluido: "Concluído",
    cancelado: "Cancelado",
  }[status];
}

export function statusAgendamentoTone(status: StatusAgendamento): Tone {
  return {
    confirmado: "accent",
    pendente: "warning",
    concluido: "success",
    cancelado: "danger",
  }[status] as Tone;
}

export function statusProfissionalLabel(status: StatusProfissional): string {
  return status === "ativo" ? "Ativo" : "Inativo";
}

export function statusProfissionalTone(status: StatusProfissional): Tone {
  return status === "ativo" ? "success" : "neutral";
}

export function statusRepasseLabel(status: StatusRepasse): string {
  return status === "realizado" ? "Realizado" : "Pendente";
}

export function statusRepasseTone(status: StatusRepasse): Tone {
  return status === "realizado" ? "success" : "warning";
}
