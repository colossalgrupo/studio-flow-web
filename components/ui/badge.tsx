import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Tone = "neutral" | "accent" | "gold" | "rose" | "success" | "warning" | "danger";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-border/60 text-foreground",
  accent: "bg-accent/15 text-accent",
  gold: "bg-gold/15 text-gold",
  rose: "bg-rose/15 text-rose",
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
};

export function Badge({
  className,
  tone = "neutral",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
