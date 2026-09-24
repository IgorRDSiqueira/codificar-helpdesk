import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  getTicketById,
  listAssignees,
} from "@/services/ticket.service";

import { EditTicketForm } from "./edit-ticket-form";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditarChamadoPage({
  params,
}: PageProps) {
  const { id } = await params;

  const [ticket, assignees] =
    await Promise.all([
      getTicketById(id),
      listAssignees(),
    ]);

  if (!ticket) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-6 py-4">
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
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">
        <Link
          href={`/chamados/${ticket.id}`}
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para o chamado
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Editar chamado
          </h1>

          <p className="mt-1 text-muted-foreground">
            Atualize as informações e o andamento
            da solicitação.
          </p>
        </div>

        <EditTicketForm
          ticket={{
            id: ticket.id,
            title: ticket.title,
            requesterName:
              ticket.requesterName,
            description:
              ticket.description,
            priority: ticket.priority,
            status: ticket.status,
            assigneeId:
              ticket.assigneeId,
          }}
          assignees={assignees.map(
            (assignee) => ({
              id: assignee.id,
              name: assignee.name,
            }),
          )}
        />
      </div>
    </main>
  );
}