"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Shuffle,
  UserRound,
} from "lucide-react";

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

interface TicketFormProps {
  assignees: Assignee[];
}

type AssignmentMode =
  | "automatic"
  | "manual";

export function TicketForm({
  assignees,
}: TicketFormProps) {
  const router = useRouter();

  const [title, setTitle] =
    useState("");

  const [
    requesterName,
    setRequesterName,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [priority, setPriority] =
    useState("MEDIUM");

  const [
    assignmentMode,
    setAssignmentMode,
  ] =
    useState<AssignmentMode>(
      "automatic",
    );

  const [assigneeId, setAssigneeId] =
    useState(
      assignees[0]?.id ?? "",
    );

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

    if (
      assignmentMode === "manual" &&
      !assigneeId
    ) {
      setError(
        "Selecione um responsável.",
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/tickets",
        {
          method: "POST",

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

            automaticAssignment:
              assignmentMode ===
              "automatic",

            assigneeId:
              assignmentMode ===
              "manual"
                ? assigneeId
                : undefined,
          }),
        },
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ??
            "Não foi possível criar o chamado.",
        );
      }

      router.push(
        `/chamados/${data.id}`,
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar o chamado.",
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
          Preencha os dados da
          solicitação e escolha como ela
          será atribuída.
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
              placeholder="Ex.: Computador não liga"
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

            <p className="text-xs text-muted-foreground">
              Informe o nome da pessoa
              que abriu o chamado.
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
              placeholder="Descreva o problema ou a solicitação..."
              rows={6}
              disabled={loading}
            />
          </div>

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

          <div className="space-y-3">
            <Label>
              Responsável pelo atendimento
            </Label>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setAssignmentMode(
                  "automatic",
                )
              }
              className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                assignmentMode ===
                "automatic"
                  ? "border-foreground bg-muted"
                  : "hover:bg-muted/50"
              }`}
            >
              <Shuffle className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-medium">
                  Distribuição automática
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  O sistema selecionará o
                  responsável com menos
                  chamados ativos.
                </p>
              </div>
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() =>
                setAssignmentMode(
                  "manual",
                )
              }
              className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                assignmentMode ===
                "manual"
                  ? "border-foreground bg-muted"
                  : "hover:bg-muted/50"
              }`}
            >
              <UserRound className="mt-0.5 h-5 w-5 shrink-0" />

              <div>
                <p className="font-medium">
                  Escolher manualmente
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Selecione quem será
                  responsável pelo
                  atendimento.
                </p>
              </div>
            </button>
          </div>

          {assignmentMode ===
            "manual" && (
            <div className="space-y-2">
              <Label htmlFor="assignee">
                Responsável
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
            </div>
          )}

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
                  "/chamados",
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
                  Criando...
                </>
              ) : (
                "Criar chamado"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}