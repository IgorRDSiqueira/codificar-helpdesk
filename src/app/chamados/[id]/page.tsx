import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Pencil,
  User,
  UserRound,
} from "lucide-react";

import { getTicketById } from "@/services/ticket.service";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

export default async function ChamadoPage({
  params,
}: PageProps) {
  const { id } = await params;

  const ticket = await getTicketById(id);

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

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/chamados"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para chamados
          </Link>

          <Link
            href={`/chamados/${ticket.id}/editar`}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
            Editar chamado
          </Link>
        </div>

        <div className="mb-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <Badge variant="outline">
              {priorityLabel[ticket.priority]}
            </Badge>

            <Badge>
              {statusLabel[ticket.status]}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            {ticket.title}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Chamado #{ticket.id.slice(-8).toUpperCase()}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>
                Descrição
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className="whitespace-pre-wrap leading-7">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Atendimento
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Solicitante
                  </p>

                  <div className="flex items-center gap-2 font-medium">
                    <User className="h-4 w-4 text-muted-foreground" />

                    {ticket.requesterName}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Responsável
                  </p>

                  <div className="flex items-center gap-2 font-medium">
                    <UserRound className="h-4 w-4 text-muted-foreground" />

                    {ticket.assignee.name}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Prioridade
                  </p>

                  <Badge variant="outline">
                    {priorityLabel[ticket.priority]}
                  </Badge>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Status
                  </p>

                  <Badge>
                    {statusLabel[ticket.status]}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Datas
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5">
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Aberto em
                  </p>

                  <div className="flex items-start gap-2 text-sm">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                    <span>
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Última atualização
                  </p>

                  <div className="flex items-start gap-2 text-sm">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

                    <span>
                      {formatDate(ticket.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
