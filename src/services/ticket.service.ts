import { prisma } from "@/lib/prisma";

import {
  Priority,
  TicketStatus,
} from "@/generated/prisma/client";

import { getLeastBusyAssignee } from "@/services/assignment.service";

export interface CreateTicketInput {
  title: string;
  description: string;
  requesterName: string;
  priority: Priority;
  assigneeId?: string;
  automaticAssignment?: boolean;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  requesterName?: string;
  priority?: Priority;
  status?: TicketStatus;
  assigneeId?: string;
}

export async function createTicket(
  input: CreateTicketInput,
) {
  let assigneeId = input.assigneeId;

  if (
    input.automaticAssignment ||
    !assigneeId
  ) {
    const assignee =
      await getLeastBusyAssignee();

    assigneeId = assignee.id;
  }

  return prisma.ticket.create({
    data: {
      title: input.title,
      description: input.description,
      requesterName: input.requesterName,
      priority: input.priority,
      assigneeId,
    },

    include: {
      assignee: true,
    },
  });
}

export async function listTickets() {
  return prisma.ticket.findMany({
    include: {
      assignee: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTicketById(
  id: string,
) {
  return prisma.ticket.findUnique({
    where: {
      id,
    },

    include: {
      assignee: true,
    },
  });
}

export async function updateTicket(
  id: string,
  input: UpdateTicketInput,
) {
  return prisma.ticket.update({
    where: {
      id,
    },

    data: input,

    include: {
      assignee: true,
    },
  });
}

export async function listAssignees() {
  return prisma.assignee.findMany({
    orderBy: {
      name: "asc",
    },
  });
}