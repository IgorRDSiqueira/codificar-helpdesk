import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { listAssignees } from "@/services/ticket.service";
import { TicketForm } from "./ticket-form";

export default async function NovoChamadoPage() {
  const assignees = await listAssignees();

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
          href="/chamados"
          className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para chamados
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Novo chamado
          </h1>

          <p className="mt-1 text-muted-foreground">
            Registre uma nova solicitação para a equipe de suporte.
          </p>
        </div>

        <TicketForm
          assignees={assignees.map((assignee) => ({
            id: assignee.id,
            name: assignee.name,
          }))}
        />
      </div>
    </main>
  );
}