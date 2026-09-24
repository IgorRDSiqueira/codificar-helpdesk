"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  Clock3,
  Search,
  SlidersHorizontal,
  UserRound,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assigneeId: string;
  assigneeName: string;
  createdAt: string;
}

interface Assignee {
  id: string;
  name: string;
}

interface TicketsListProps {
  tickets: Ticket[];
  assignees: Assignee[];
}

const priorityLabel: Record<string, string> = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

const statusLabel: Record<string, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function TicketsList({
  tickets,
  assignees,
}: TicketsListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [priority, setPriority] = useState("ALL");
  const [assigneeId, setAssigneeId] =
    useState("ALL");

  const filteredTickets = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLocaleLowerCase("pt-BR");

    return tickets.filter((ticket) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        ticket.title
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch) ||
        ticket.description
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch) ||
        ticket.assigneeName
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch);

      const matchesStatus =
        status === "ALL" ||
        ticket.status === status;

      const matchesPriority =
        priority === "ALL" ||
        ticket.priority === priority;

      const matchesAssignee =
        assigneeId === "ALL" ||
        ticket.assigneeId === assigneeId;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesAssignee
      );
    });
  }, [
    tickets,
    search,
    status,
    priority,
    assigneeId,
  ]);

  const hasFilters =
    search !== "" ||
    status !== "ALL" ||
    priority !== "ALL" ||
    assigneeId !== "ALL";

  function clearFilters() {
    setSearch("");
    setStatus("ALL");
    setPriority("ALL");
    setAssigneeId("ALL");
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle>
            Lista de chamados
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Pesquise e filtre as solicitações para
            encontrar rapidamente o que precisa.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted/20 p-4">
          <div className="mb-4 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            <span className="text-sm font-medium">
              Busca e filtros
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar por título, descrição ou responsável..."
                className="pl-9"
              />
            </div>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/50"
              aria-label="Filtrar por status"
            >
              <option value="ALL">
                Todos os status
              </option>

              <option value="OPEN">
                Aberto
              </option>

              <option value="IN_PROGRESS">
                Em andamento
              </option>

              <option value="RESOLVED">
                Resolvido
              </option>

              <option value="CLOSED">
                Fechado
              </option>
            </select>

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/50"
              aria-label="Filtrar por prioridade"
            >
              <option value="ALL">
                Todas as prioridades
              </option>

              <option value="LOW">
                Baixa
              </option>

              <option value="MEDIUM">
                Média
              </option>

              <option value="HIGH">
                Alta
              </option>
            </select>

            <select
              value={assigneeId}
              onChange={(event) =>
                setAssigneeId(event.target.value)
              }
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/50"
              aria-label="Filtrar por responsável"
            >
              <option value="ALL">
                Todos os responsáveis
              </option>

              {assignees.map((assignee) => (
                <option
                  key={assignee.id}
                  value={assignee.id}
                >
                  {assignee.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">
                {filteredTickets.length}
              </strong>{" "}
              {filteredTickets.length === 1
                ? "chamado encontrado"
                : "chamados encontrados"}
            </p>

            {hasFilters && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <Search className="mb-4 h-8 w-8 text-muted-foreground" />

            <h2 className="font-semibold">
              Nenhum chamado encontrado
            </h2>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Não encontramos chamados que correspondam
              aos filtros selecionados.
            </p>

            {hasFilters && (
              <Button
                type="button"
                variant="outline"
                className="mt-5"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" />
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Chamado
                  </TableHead>

                  <TableHead>
                    Prioridade
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Responsável
                  </TableHead>

                  <TableHead>
                    Aberto em
                  </TableHead>

                  <TableHead className="text-right">
                    Ação
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="font-medium">
                          {ticket.title}
                        </p>

                        <p className="mt-1 truncate text-sm text-muted-foreground">
                          {ticket.description}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {priorityLabel[
                          ticket.priority
                        ]}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge>
                        {statusLabel[
                          ticket.status
                        ]}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <UserRound className="h-4 w-4 text-muted-foreground" />

                        {ticket.assigneeName}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 whitespace-nowrap text-sm text-muted-foreground">
                        <Clock3 className="h-4 w-4" />

                        {formatDate(
                          ticket.createdAt,
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <Link
                        href={`/chamados/${ticket.id}`}
                        className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border bg-background px-3 text-sm font-medium shadow-xs transition-colors hover:bg-muted"
                      >
                        Visualizar
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}