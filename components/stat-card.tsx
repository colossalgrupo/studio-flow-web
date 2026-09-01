import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "accent",
  helpText,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "accent" | "gold" | "rose";
  helpText?: string;
}) {
  const toneClasses = {
    accent: "bg-accent/15 text-accent",
    gold: "bg-gold/15 text-gold",
    rose: "bg-rose/15 text-rose",
  }[tone];

  return (
    <Card>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          {helpText && <p className="mt-1 text-xs text-muted">{helpText}</p>}
        </div>
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", toneClasses)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
