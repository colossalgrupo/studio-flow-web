import { formatCurrency } from "@/lib/utils";

export function RevenueChart({ dados }: { dados: { data: string; valor: number }[] }) {
  const max = Math.max(...dados.map((d) => d.valor), 1);

  return (
    <div className="flex h-48 gap-2 sm:gap-3">
      {dados.map((d) => {
        const altura = Math.max((d.valor / max) * 100, 4);
        const dia = new Date(`${d.data}T00:00:00`).toLocaleDateString("pt-BR", { weekday: "short" });
        return (
          <div key={d.data} className="group flex flex-1 flex-col items-center gap-2">
            <div className="relative flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t-md bg-accent/70 transition-colors group-hover:bg-accent"
                style={{ height: `${altura}%` }}
                title={formatCurrency(d.valor)}
              />
            </div>
            <span className="text-xs capitalize text-muted">{dia.replace(".", "")}</span>
          </div>
        );
      })}
    </div>
  );
}
