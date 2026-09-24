export interface AssigneeWorkload {
  id: string;
  activeTickets: number;
}

export function selectLeastBusyAssignee<
  T extends AssigneeWorkload,
>(assignees: T[]): T {
  if (assignees.length === 0) {
    throw new Error(
      "Nenhum responsável disponível.",
    );
  }

  return assignees.reduce(
    (leastBusy, current) =>
      current.activeTickets <
      leastBusy.activeTickets
        ? current
        : leastBusy,
  );
}