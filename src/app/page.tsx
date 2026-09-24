import Link from "next/link";
import {
  ArrowLeft,
  Clock3,
  Plus,
  Ticket,
  UserRound,
} from "lucide-react";

import { listTickets } from "@/services/ticket.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const priorityLabel = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
};

const statusLabel = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function TicketsPage() {
  const tickets = await listTickets();

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <Link
              href="/"
              className="text-xl font-bold transition-opacity hover:opacity-70"
            >
              HelpDesk
            </Link>

            <p className="text-sm text-muted-foreground">
              Gestão de chamados internos
            </p>
          </div>

          <Button
            render={
              <Link href="/chamados/novo">
                <Plus />
                Novo chamado
              </Link>
            }
          />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/"
              className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para visão geral
            </Link>

            <h1 className="text-3xl font-bold tracking-tight">
              Chamados
            </h1>

            <p className="mt-1 text-muted-foreground">
              Acompanhe todas as solicitações registradas.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm">
            <Ticket className="h-4 w-4 text-muted-foreground" />

            <span className="text-muted-foreground">
              Total:
            </span>

            <strong>{tickets.length}</strong>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lista de chamados</CardTitle>

            <p className="text-sm text-muted-foreground">
              Visualize prioridade, status, responsável e data de abertura.
            </p>
          </CardHeader>

          <CardContent>
            {tickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Ticket className="h-6 w-6 text-muted-foreground" />
                </div>

                <h2 className="font-semibold">
                  Nenhum chamado encontrado
                </h2>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Quando uma solicitação for registrada, ela aparecerá
                  nesta página.
                </p>

                <Button
                  className="mt-5"
                  render={
                    <Link href="/chamados/novo">
                      <Plus />
                      Criar primeiro chamado
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chamado</TableHead>
                      <TableHead>Prioridade</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Aberto em</TableHead>
                      <TableHead className="text-right">
                        Ação
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {tickets.map((ticket) => (
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
                            {priorityLabel[ticket.priority]}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <Badge>
                            {statusLabel[ticket.status]}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2">
                            <UserRound className="h-4 w-4 text-muted-foreground" />
                            {ticket.assignee.name}
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock3 className="h-4 w-4" />
                            {formatDate(ticket.createdAt)}
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            render={
                              <Link
                                href={`/chamados/${ticket.id}`}
                              >
                                Visualizar
                              </Link>
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}