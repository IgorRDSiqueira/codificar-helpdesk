import { prisma } from "@/lib/prisma";
import { TicketStatus } from "@/generated/prisma/client";

import {
  selectLeastBusyAssignee,
} from "@/services/assignment-rule";

export const ACTIVE_STATUSES: TicketStatus[] = [
  TicketStatus.OPEN,
  TicketStatus.IN_PROGRESS,
];

export async function getLeastBusyAssignee() {
  const assignees =
    await prisma.assignee.findMany({
      orderBy: {
        createdAt: "asc",
      },

      include: {
        _count: {
          select: {
            tickets: {
              where: {
                status: {
                  in: ACTIVE_STATUSES,
                },
              },
            },
          },
        },
      },
    });

  const workloads = assignees.map(
    (assignee) => ({
      ...assignee,
      activeTickets:
        assignee._count.tickets,
    }),
  );

  return selectLeastBusyAssignee(
    workloads,
  );
}