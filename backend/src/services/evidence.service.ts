import {
  createEvidence,
  findEvidenceByCase,
  findEvidenceById,
  updateEvidence,
  deleteEvidence,
  type CreateEvidenceInput,
  type UpdateEvidenceInput,
} from "../repositories/evidence.repository.js";
import { findCaseById } from "../repositories/case.repository.js";

async function assertCaseOwnership(caseId: string, userId: string): Promise<void> {
  const caseRecord = await findCaseById(caseId, userId);
  if (!caseRecord) {
    throw new Error("Case not found.");
  }
}

async function assertEvidenceOwnership(evidenceId: string, userId: string): Promise<void> {
  const evidence = await findEvidenceById(evidenceId);
  if (!evidence) {
    throw new Error("Evidence not found.");
  }
  const caseRecord = await findCaseById(evidence.caseId, userId);
  if (!caseRecord) {
    throw new Error("Evidence not found.");
  }
}

export async function createEvidenceForCase(
  caseId: string,
  userId: string,
  input: Omit<CreateEvidenceInput, "caseId">
) {
  await assertCaseOwnership(caseId, userId);
  return createEvidence({ ...input, caseId });
}

export async function getEvidenceForCase(caseId: string, userId: string) {
  await assertCaseOwnership(caseId, userId);
  return findEvidenceByCase(caseId);
}

export async function getEvidenceById(id: string, userId: string) {
  const evidence = await findEvidenceById(id);
  if (!evidence) {
    throw new Error("Evidence not found.");
  }
  const caseRecord = await findCaseById(evidence.caseId, userId);
  if (!caseRecord) {
    throw new Error("Evidence not found.");
  }
  return evidence;
}

export async function updateEvidenceById(
  id: string,
  userId: string,
  input: UpdateEvidenceInput
) {
  await assertEvidenceOwnership(id, userId);
  return updateEvidence(id, input);
}

export async function deleteEvidenceById(id: string, userId: string) {
  await assertEvidenceOwnership(id, userId);
  await deleteEvidence(id);
}
