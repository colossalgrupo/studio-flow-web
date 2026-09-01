import { initials } from "@/lib/utils";

export function Avatar({ nome, cor, size = 36 }: { nome: string; cor?: string; size?: number }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ backgroundColor: cor ?? "#0F6B5C", width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(nome)}
    </div>
  );
}
