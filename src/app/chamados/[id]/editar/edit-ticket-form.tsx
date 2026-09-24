"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Assignee {
  id: string;
  name: string;
}

interface Ticket {
  id: string;
  title: string;
  requesterName: string;
  description: string;
  priority: string;
  status: string;
  assigneeId: string;
}

interface EditTicketFormProps {
  ticket: Ticket;
  assignees: Assignee[];
}

export function EditTicketForm({
  ticket,
  assignees,
}: EditTicketFormProps) {
  const router = useRouter();

  const [title, setTitle] =
    useState(ticket.title);

  const [
    requesterName,
    setRequesterName,
  ] = useState(ticket.requesterName);

  const [description, setDescription] =
    useState(ticket.description);

  const [priority, setPriority] =
    useState(ticket.priority);

  const [status, setStatus] =
    useState(ticket.status);

  const [assigneeId, setAssigneeId] =
    useState(ticket.assigneeId);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError(
        "Informe o título do chamado.",
      );
      return;
    }

    if (!requesterName.trim()) {
      setError(
        "Informe o nome do solicitante.",
      );
      return;
    }

    if (!description.trim()) {
      setError(
        "Informe a descrição do chamado.",
      );
      return;
    }

    if (!assigneeId) {
      setError(
        "Selecione um responsável.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/tickets/${ticket.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            requesterName:
              requesterName.trim(),
            description:
              description.trim(),
            priority,
            status,
            assigneeId,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Não foi possível atualizar o chamado.",
        );
      }

      router.push(
        `/chamados/${ticket.id}`,
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível atualizar o chamado.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Informações do chamado
        </CardTitle>

        <p className="text-sm text-muted-foreground">
          Edite os dados, altere o status
          ou transfira o atendimento.
        </p>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title">
              Título
            </Label>

            <Input
              id="title"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              maxLength={120}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requesterName">
              Solicitante
            </Label>

            <Input
              id="requesterName"
              value={requesterName}
              onChange={(event) =>
                setRequesterName(
                  event.target.value,
                )
              }
              placeholder="Ex.: João da Silva"
              maxLength={120}
              autoComplete="name"
              disabled={loading}
            />

            <p className="text-sm text-muted-foreground">
              Pessoa que abriu o chamado.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição
            </Label>

            <Textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value,
                )
              }
              rows={6}
              disabled={loading}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="priority">
                Prioridade
              </Label>

              <select
                id="priority"
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value,
                  )
                }
                disabled={loading}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status
              </Label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value,
                  )
                }
                disabled={loading}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
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
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">
              Responsável pelo atendimento
            </Label>

            <select
              id="assignee"
              value={assigneeId}
              onChange={(event) =>
                setAssigneeId(
                  event.target.value,
                )
              }
              disabled={loading}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {assignees.map(
                (assignee) => (
                  <option
                    key={assignee.id}
                    value={assignee.id}
                  >
                    {assignee.name}
                  </option>
                ),
              )}
            </select>

            <p className="text-sm text-muted-foreground">
              Você pode transferir este
              chamado para outro responsável.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() =>
                router.push(
                  `/chamados/${ticket.id}`,
                )
              }
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar alterações"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}