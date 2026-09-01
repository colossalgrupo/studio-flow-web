"use client";

import { Loader2, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/avatar";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { statusProfissionalLabel, statusProfissionalTone } from "@/lib/status";
import type { Profissional } from "@/lib/types";
import { listarProfissionais } from "@/services/professionals";
import { NovoProfissionalModal } from "./novo-profissional-modal";

export default function ProfissionaisPage() {
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  function carregar() {
    setCarregando(true);
    listarProfissionais().then((data) => {
      setProfissionais(data);
      setCarregando(false);
    });
  }

  useEffect(carregar, []);

  const filtrados = useMemo(
    () =>
      profissionais.filter(
        (p) =>
          p.nome.toLowerCase().includes(busca.toLowerCase()) ||
          p.especialidades.some((e) => e.toLowerCase().includes(busca.toLowerCase())),
      ),
    [profissionais, busca],
  );

  return (
    <div>
      <PageHeader
        title="Profissionais"
        description="Cadastro, especialidades, repasse e comissão da sua equipe"
        action={
          <Button onClick={() => setModalAberto(true)}>
            <Plus className="h-4 w-4" />
            Novo profissional
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-2">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            placeholder="Buscar por nome ou especialidade"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {carregando ? (
            <div className="flex h-40 items-center justify-center text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>Profissional</Th>
                  <Th>Especialidades</Th>
                  <Th>Repasse</Th>
                  <Th>Chave Pix</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filtrados.map((p) => (
                  <Tr key={p.id}>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar nome={p.nome} cor={p.avatarCor} />
                        <div>
                          <p className="font-medium">{p.nome}</p>
                          <p className="text-xs text-muted">{p.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {p.especialidades.slice(0, 2).map((e) => (
                          <Badge key={e} tone="accent">
                            {e}
                          </Badge>
                        ))}
                        {p.especialidades.length > 2 && (
                          <Badge tone="neutral">+{p.especialidades.length - 2}</Badge>
                        )}
                      </div>
                    </Td>
                    <Td className="capitalize">{p.periodicidadeRepasse}</Td>
                    <Td className="text-muted">{p.contaBancaria.chavePix}</Td>
                    <Td>
                      <Badge tone={statusProfissionalTone(p.status)}>
                        {statusProfissionalLabel(p.status)}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
                {filtrados.length === 0 && (
                  <Tr>
                    <Td colSpan={5} className="py-10 text-center text-muted">
                      Nenhum profissional encontrado.
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NovoProfissionalModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onCriado={() => {
          setModalAberto(false);
          carregar();
        }}
      />
    </div>
  );
}
