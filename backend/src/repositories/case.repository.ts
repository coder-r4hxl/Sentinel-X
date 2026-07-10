import { prisma } from "../lib/prisma.js";

export type CreateCaseInput = {
  title: string;
  description?: string;
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  userId: string;
};

export type UpdateCaseInput = {
  title?: string;
  description?: string;
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  severity?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

export async function createCase(input: CreateCaseInput) {
  return prisma.case.create({
    data: {
      title: input.title,
      description: input.description,
      status: input.status ?? "OPEN",
      severity: input.severity ?? "MEDIUM",
      userId: input.userId,
    },
  });
}

export async function findCasesByUser(userId: string) {
  return prisma.case.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findCaseById(id: string, userId: string) {
  return prisma.case.findFirst({ where: { id, userId } });
}

export async function updateCase(id: string, userId: string, data: UpdateCaseInput) {
  return prisma.case.updateMany({
    where: { id, userId },
    data,
  });
}

export async function deleteCase(id: string, userId: string) {
  return prisma.case.deleteMany({ where: { id, userId } });
}
