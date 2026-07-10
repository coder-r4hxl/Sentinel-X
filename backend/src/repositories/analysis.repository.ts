import { prisma } from "../lib/prisma.js";

export type CreateAnalysisInput = {
  evidenceId: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  summary?: string;
  findings?: unknown;
  riskScore?: number;
};

export type UpdateAnalysisInput = {
  status?: "PENDING" | "COMPLETED" | "FAILED";
  summary?: string;
  findings?: unknown;
  riskScore?: number;
};

export async function findAnalysisByEvidenceId(evidenceId: string) {
  return prisma.evidenceAnalysis.findUnique({ where: { evidenceId } });
}

export async function createAnalysis(input: CreateAnalysisInput) {
  return prisma.evidenceAnalysis.create({
    data: {
      evidenceId: input.evidenceId,
      status: input.status,
      summary: input.summary,
      findings: input.findings ?? undefined,
      riskScore: input.riskScore,
    },
  });
}

export async function updateAnalysis(evidenceId: string, data: UpdateAnalysisInput) {
  return prisma.evidenceAnalysis.update({
    where: { evidenceId },
    data: {
      status: data.status,
      summary: data.summary,
      findings: data.findings ?? undefined,
      riskScore: data.riskScore,
    },
  });
}
