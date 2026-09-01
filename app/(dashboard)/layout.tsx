"use client";

import { LogOut, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/avatar";
import { DashboardNav } from "@/components/dashboard-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth/context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { usuario, carregando, autenticado, sair } = useAuth();
  const router = useRouter();
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!carregando && !autenticado) {
      router.replace("/login");
    }
  }, [carregando, autenticado, router]);

  if (carregando || !autenticado || !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-muted">
        Carregando painel…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar - desktop */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <BrandHeader negocio={usuario.negocio} />
        <DashboardNav />
      </aside>

      {/* Sidebar - mobile */}
      {menuAberto && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <button
            aria-label="Fechar menu"
            className="fixed inset-0 bg-black/40"
            onClick={() => setMenuAberto(false)}
          />
          <aside className="relative flex w-64 flex-col border-r border-border bg-surface">
            <div className="flex items-center justify-between p-4">
              <BrandHeader negocio={usuario.negocio} compact />
              <button onClick={() => setMenuAberto(false)} aria-label="Fechar menu" className="p-1 text-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <DashboardNav onNavigate={() => setMenuAberto(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
          <button
            aria-label="Abrir menu"
            className="p-1 text-foreground lg:hidden"
            onClick={() => setMenuAberto(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden items-center gap-2 sm:flex">
              <Avatar nome={usuario.nome} size={32} />
              <div className="text-sm">
                <p className="font-medium leading-tight">{usuario.nome}</p>
                <p className="leading-tight text-muted">{usuario.email}</p>
              </div>
            </div>
            <button
              aria-label="Sair"
              onClick={() => sair().then(() => router.replace("/login"))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-background"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

function BrandHeader({ negocio, compact = false }: { negocio: string; compact?: boolean }) {
  return (
    <div className={compact ? "" : "p-5"}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground">
          SF
        </div>
        <span className="text-lg font-semibold tracking-tight">Studio Flow</span>
      </div>
      <p className="mt-1 truncate text-xs text-muted">{negocio}</p>
    </div>
  );
}
