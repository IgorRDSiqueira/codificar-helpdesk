import { NextResponse } from "next/server";

import {
  Priority,
  TicketStatus,
} from "@/generated/prisma/client";

import {
  getTicketById,
  updateTicket,
} from "@/services/ticket.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const ticket = await getTicketById(id);

    if (!ticket) {
      return NextResponse.json(
        {
          message: "Chamado não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(ticket);
  } catch {
    return NextResponse.json(
      {
        message: "Erro ao buscar chamado.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const existingTicket =
      await getTicketById(id);

    if (!existingTicket) {
      return NextResponse.json(
        {
          message: "Chamado não encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const {
      title,
      requesterName,
      description,
      priority,
      status,
      assigneeId,
    } = body;

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          message: "Título é obrigatório.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof requesterName !== "string" ||
      !requesterName.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Solicitante é obrigatório.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Descrição é obrigatória.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Object.values(Priority).includes(
        priority,
      )
    ) {
      return NextResponse.json(
        {
          message: "Prioridade inválida.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !Object.values(
        TicketStatus,
      ).includes(status)
    ) {
      return NextResponse.json(
        {
          message: "Status inválido.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof assigneeId !== "string" ||
      !assigneeId
    ) {
      return NextResponse.json(
        {
          message:
            "Responsável é obrigatório.",
        },
        {
          status: 400,
        },
      );
    }

    const ticket = await updateTicket(
      id,
      {
        title: title.trim(),
        requesterName:
          requesterName.trim(),
        description:
          description.trim(),
        priority,
        status,
        assigneeId,
      },
    );

    return NextResponse.json(ticket);
  } catch {
    return NextResponse.json(
      {
        message:
          "Erro ao atualizar chamado.",
      },
      {
        status: 500,
      },
    );
  }
}