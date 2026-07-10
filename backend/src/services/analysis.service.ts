import { findEvidenceById } from "../repositories/evidence.repository.js";
import { findCaseById } from "../repositories/case.repository.js";
import {
  findAnalysisByEvidenceId,
  createAnalysis,
  updateAnalysis,
} from "../repositories/analysis.repository.js";
import { StubAnalysisProvider } from "../ai/stub.provider.js";
import type { AnalysisProvider } from "../ai/analysis.interface.js";

const provider: AnalysisProvider = new StubAnalysisProvider();

async function assertEvidenceOwnership(
  evidenceId: string,
  userId: string
): Promise<{ id: string; label: string; description: string | null; fileName: string | null; mimeType: string | null; fileSize: number | null; caseId: string }> {
  const evidence = await findEvidenceById(evidenceId);
  if (!evidence) {
    throw new Error("Evidence not found.");
  }
  const caseRecord = await findCaseById(evidence.caseId, userId);
  if (!caseRecord) {
    throw new Error("Evidence not found.");
  }
  return evidence;
}

export async function runAnalysis(evidenceId: string, userId: string) {
  const evidence = await assertEvidenceOwnership(evidenceId, userId);

  const existing = await findAnalysisByEvidenceId(evidenceId);
  if (existing && existing.status === "COMPLETED") {
    return existing;
  }

  if (!existing) {
    await createAnalysis({ evidenceId, status: "PENDING" });
  } else {
    await updateAnalysis(evidenceId, { status: "PENDING" });
  }

  try {
    const result = await provider.analyze({
      id: evidence.id,
      label: evidence.label,
      description: evidence.description,
      fileName: evidence.fileName,
      mimeType: evidence.mimeType,
      fileSize: evidence.fileSize,
    });

    return updateAnalysis(evidenceId, {
      status: "COMPLETED",
      summary: result.summary,
      findings: result.findings,
      riskScore: result.riskScore,
    });
  } catch {
    await updateAnalysis(evidenceId, { status: "FAILED" });
    throw new Error("Analysis failed.");
  }
}

export async function getAnalysis(evidenceId: string, userId: string) {
  await assertEvidenceOwnership(evidenceId, userId);
  const analysis = await findAnalysisByEvidenceId(evidenceId);
  if (!analysis) {
    throw new Error("No analysis found for this evidence.");
  }
  return analysis;
}
