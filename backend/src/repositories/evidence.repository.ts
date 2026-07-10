import { prisma } from "../lib/prisma.js";

export type CreateEvidenceInput = {
  label: string;
  description?: string;
  fileName?: string;
  filePath?: string;
  mimeType?: string;
  fileSize?: number;
  caseId: string;
};

export type UpdateEvidenceInput = {
  label?: string;
  description?: string;
  fileName?: string;
  filePath?: string;
  mimeType?: string;
  fileSize?: number;
};

export async function createEvidence(input: CreateEvidenceInput) {
  return prisma.evidence.create({
    data: {
      label: input.label,
      description: input.description,
      fileName: input.fileName,
      filePath: input.filePath,
      mimeType: input.mimeType,
      fileSize: input.fileSize,
      caseId: input.caseId,
    },
  });
}

export async function findEvidenceByCase(caseId: string) {
  return prisma.evidence.findMany({
    where: { caseId },
    orderBy: { createdAt: "desc" },
  });
}

export async function findEvidenceById(id: string) {
  return prisma.evidence.findUnique({ where: { id } });
}

export async function updateEvidence(id: string, data: UpdateEvidenceInput) {
  return prisma.evidence.update({ where: { id }, data });
}

export async function deleteEvidence(id: string) {
  return prisma.evidence.delete({ where: { id } });
}
