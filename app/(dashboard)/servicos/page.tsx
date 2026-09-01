"use client";

import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, Tbody, Td, Th, Thead, Tr } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import type { Profissional, Servico } from "@/lib/types";
import { listarProfissionais } from "@/services/professionals";
import { listarServicos } from "@/services/services";
import { NovoServicoModal } from "./novo-servico-modal";

export default function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  function carregar() {
    setCarregando(true);
    Promise.all([listarServicos(), listarProfissionais()]).then(([s, p]) => {
      setServicos(s);
      setProfissionais(p);
      setCarregando(false);
    });
  }

  useEffect(carregar, []);

  const nomesProfissionais = (ids: string[]) =>
    ids.map((id) => profissionais.find((p) => p.id === id)?.nome).filter(Boolean) as string[];

  return (
    <div>
      <PageHeader
        title="Catálogo de serviços"
        description="Duração, preço-base e profissionais vinculados"
        action={
          <Button onClick={() => setModalAberto(true)}>
            <Plus className="h-4 w-4" />
            Novo serviço
          </Button>
        }
      />

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
                  <Th>Serviço</Th>
                  <Th>Categoria</Th>
                  <Th>Duração</Th>
                  <Th>Preço-base</Th>
                  <Th>Profissionais</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {servicos.map((s) => (
                  <Tr key={s.id}>
                    <Td className="font-medium">{s.nome}</Td>
                    <Td>
                      <Badge tone="rose">{s.categoria}</Badge>
                    </Td>
                    <Td>{s.duracaoMinutos} min</Td>
                    <Td>{formatCurrency(s.precoBase)}</Td>
                    <Td>
                      <div className="flex flex-wrap gap-1">
                        {nomesProfissionais(s.profissionaisIds).map((n) => (
                          <Badge key={n} tone="accent">
                            {n}
                          </Badge>
                        ))}
                        {nomesProfissionais(s.profissionaisIds).length === 0 && (
                          <span className="text-muted">—</span>
                        )}
                      </div>
                    </Td>
                    <Td>
                      <Badge tone={s.ativo ? "success" : "neutral"}>{s.ativo ? "Ativo" : "Inativo"}</Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NovoServicoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        profissionais={profissionais}
        onCriado={() => {
          setModalAberto(false);
          carregar();
        }}
      />
    </div>
  );
}
