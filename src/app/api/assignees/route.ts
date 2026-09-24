import { NextResponse } from "next/server";
import { listAssignees } from "@/services/ticket.service";

export async function GET() {
  try {
    const assignees = await listAssignees();

    return NextResponse.json(assignees);
  } catch {
    return NextResponse.json(
      {
        message: "Erro ao buscar responsáveis.",
      },
      { status: 500 },
    );
  }
}