import { NextResponse } from "next/server";

import { Priority } from "@/generated/prisma/client";

import {
  createTicket,
  listTickets,
} from "@/services/ticket.service";

export async function GET() {
  try {
    const tickets = await listTickets();

    return NextResponse.json(tickets);
  } catch {
    return NextResponse.json(
      {
        message: "Erro ao buscar chamados.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  try {
    const body = await request.json();

    const {
      title,
      description,
      requesterName,
      priority,
      assigneeId,
      automaticAssignment,
    } = body;

    if (
      !title?.trim() ||
      !description?.trim() ||
      !requesterName?.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Título, descrição e solicitante são obrigatórios.",
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
          message:
            "Prioridade inválida.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !automaticAssignment &&
      !assigneeId
    ) {
      return NextResponse.json(
        {
          message:
            "Selecione um responsável ou utilize a distribuição automática.",
        },
        {
          status: 400,
        },
      );
    }

    const ticket = await createTicket({
      title: title.trim(),
      description:
        description.trim(),
      requesterName:
        requesterName.trim(),
      priority,
      assigneeId,
      automaticAssignment,
    });

    return NextResponse.json(
      ticket,
      {
        status: 201,
      },
    );
  } catch {
    return NextResponse.json(
      {
        message:
          "Erro ao criar chamado.",
      },
      {
        status: 500,
      },
    );
  }
}