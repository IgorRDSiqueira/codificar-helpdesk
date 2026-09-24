import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Ticket,
} from "lucide-react";

import {
  listAssignees,
  listTickets,
} from "@/services/ticket.service";

import { TicketsList } from "./tickets-list";

export default async function ChamadosPage() {
  const [tickets, assignees] = await Promise.all([
    listTickets(),
    listAssignees(),
  ]);

  const serializedTickets = tickets.map((ticket) => ({
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status,
    assigneeId: ticket.assigneeId,
    assigneeName: ticket.assignee.name,
    createdAt: ticket.createdAt.toISOString(),
  }));

  const serializedAssignees = assignees.map(
    (assignee) => ({
      id: assignee.id,
      name: assignee.name,
    }),
  );

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

          <Link
            href="/chamados/novo"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Novo chamado
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para visão geral
          </Link>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Chamados
              </h1>

              <p className="mt-1 text-muted-foreground">
                Acompanhe e organize todas as solicitações
                registradas.
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
        </div>

        <TicketsList
          tickets={serializedTickets}
          assignees={serializedAssignees}
        />
      </div>
    </main>
  );
}