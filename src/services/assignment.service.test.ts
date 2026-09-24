import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  TicketStatus,
} from "@/generated/prisma/client";

const { findManyMock } = vi.hoisted(() => ({
  findManyMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    assignee: {
      findMany: findManyMock,
    },
  },
}));

import {
  ACTIVE_STATUSES,
  getLeastBusyAssignee,
} from "./assignment.service";

describe("getLeastBusyAssignee", () => {
  beforeEach(() => {
    findManyMock.mockReset();
  });

  it("considera OPEN e IN_PROGRESS como status ativos", () => {
    expect(ACTIVE_STATUSES).toEqual([
      TicketStatus.OPEN,
      TicketStatus.IN_PROGRESS,
    ]);

    expect(ACTIVE_STATUSES).not.toContain(
      TicketStatus.RESOLVED,
    );

    expect(ACTIVE_STATUSES).not.toContain(
      TicketStatus.CLOSED,
    );
  });

  it("consulta somente chamados ativos ao calcular a carga", async () => {
    findManyMock.mockResolvedValue([
      {
        id: "ana",
        name: "Ana Souza",
        email: "ana@codificar.com.br",
        createdAt: new Date(
          "2026-01-01T10:00:00Z",
        ),
        updatedAt: new Date(
          "2026-01-01T10:00:00Z",
        ),
        _count: {
          tickets: 2,
        },
      },
      {
        id: "bruno",
        name: "Bruno Lima",
        email: "bruno@codificar.com.br",
        createdAt: new Date(
          "2026-01-02T10:00:00Z",
        ),
        updatedAt: new Date(
          "2026-01-02T10:00:00Z",
        ),
        _count: {
          tickets: 1,
        },
      },
    ]);

    await getLeastBusyAssignee();

    expect(
      findManyMock,
    ).toHaveBeenCalledOnce();

    expect(
      findManyMock,
    ).toHaveBeenCalledWith({
      orderBy: {
        createdAt: "asc",
      },

      include: {
        _count: {
          select: {
            tickets: {
              where: {
                status: {
                  in: [
                    TicketStatus.OPEN,
                    TicketStatus.IN_PROGRESS,
                  ],
                },
              },
            },
          },
        },
      },
    });
  });

  it("seleciona o responsável com menor carga retornada pelo banco", async () => {
    findManyMock.mockResolvedValue([
      {
        id: "ana",
        name: "Ana Souza",
        _count: {
          tickets: 4,
        },
      },
      {
        id: "bruno",
        name: "Bruno Lima",
        _count: {
          tickets: 1,
        },
      },
      {
        id: "carlos",
        name: "Carlos Mendes",
        _count: {
          tickets: 3,
        },
      },
    ]);

    const selected =
      await getLeastBusyAssignee();

    expect(selected.id).toBe(
      "bruno",
    );

    expect(selected.name).toBe(
      "Bruno Lima",
    );

    expect(
      selected.activeTickets,
    ).toBe(1);
  });

  it("usa a ordem de criação como desempate", async () => {
    findManyMock.mockResolvedValue([
      {
        id: "ana",
        name: "Ana Souza",
        _count: {
          tickets: 1,
        },
      },
      {
        id: "bruno",
        name: "Bruno Lima",
        _count: {
          tickets: 1,
        },
      },
    ]);

    const selected =
      await getLeastBusyAssignee();

    expect(selected.id).toBe(
      "ana",
    );

    expect(
      findManyMock,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: {
          createdAt: "asc",
        },
      }),
    );
  });

  it("lança erro quando não há responsáveis disponíveis", async () => {
    findManyMock.mockResolvedValue([]);

    await expect(
      getLeastBusyAssignee(),
    ).rejects.toThrow(
      "Nenhum responsável disponível.",
    );
  });
});