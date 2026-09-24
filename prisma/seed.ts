import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL não foi definida.");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const assignees = [
    {
      name: "Ana Souza",
      email: "ana@codificar.com.br",
    },
    {
      name: "Bruno Lima",
      email: "bruno@codificar.com.br",
    },
    {
      name: "Carlos Mendes",
      email: "carlos@codificar.com.br",
    },
  ];

  for (const assignee of assignees) {
    await prisma.assignee.upsert({
      where: {
        email: assignee.email,
      },
      update: {
        name: assignee.name,
      },
      create: assignee,
    });
  }

  console.log("✅ Responsáveis criados com sucesso!");
}

main()
  .catch((error) => {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });