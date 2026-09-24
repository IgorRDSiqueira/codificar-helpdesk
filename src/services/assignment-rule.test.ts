import {
  describe,
  expect,
  it,
} from "vitest";

import {
  selectLeastBusyAssignee,
} from "./assignment-rule";

describe("selectLeastBusyAssignee", () => {
  it("seleciona o responsável com menos chamados ativos", () => {
    const assignees = [
      {
        id: "ana",
        name: "Ana Souza",
        activeTickets: 3,
      },
      {
        id: "bruno",
        name: "Bruno Lima",
        activeTickets: 1,
      },
      {
        id: "carlos",
        name: "Carlos Mendes",
        activeTickets: 2,
      },
    ];

    const selected =
      selectLeastBusyAssignee(
        assignees,
      );

    expect(selected.id).toBe("bruno");
    expect(selected.name).toBe(
      "Bruno Lima",
    );
  });

  it("mantém o primeiro responsável em caso de empate", () => {
    const assignees = [
      {
        id: "ana",
        name: "Ana Souza",
        activeTickets: 1,
      },
      {
        id: "bruno",
        name: "Bruno Lima",
        activeTickets: 1,
      },
      {
        id: "carlos",
        name: "Carlos Mendes",
        activeTickets: 1,
      },
    ];

    const selected =
      selectLeastBusyAssignee(
        assignees,
      );

    expect(selected.id).toBe("ana");
  });

  it("seleciona corretamente um responsável sem chamados ativos", () => {
    const assignees = [
      {
        id: "ana",
        activeTickets: 2,
      },
      {
        id: "bruno",
        activeTickets: 0,
      },
      {
        id: "carlos",
        activeTickets: 4,
      },
    ];

    const selected =
      selectLeastBusyAssignee(
        assignees,
      );

    expect(selected.id).toBe("bruno");
    expect(selected.activeTickets).toBe(
      0,
    );
  });

  it("não altera a lista recebida", () => {
    const assignees = [
      {
        id: "ana",
        activeTickets: 2,
      },
      {
        id: "bruno",
        activeTickets: 1,
      },
    ];

    const original = structuredClone(
      assignees,
    );

    selectLeastBusyAssignee(
      assignees,
    );

    expect(assignees).toEqual(original);
  });

  it("lança erro quando não existem responsáveis", () => {
    expect(() =>
      selectLeastBusyAssignee([]),
    ).toThrow(
      "Nenhum responsável disponível.",
    );
  });
});