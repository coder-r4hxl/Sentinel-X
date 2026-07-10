import {
  createCase,
  findCasesByUser,
  findCaseById,
  updateCase,
  deleteCase,
  type CreateCaseInput,
  type UpdateCaseInput,
} from "../repositories/case.repository.js";

export async function createCaseForUser(
  userId: string,
  input: Omit<CreateCaseInput, "userId">
) {
  return createCase({ ...input, userId });
}

export async function getCasesForUser(userId: string) {
  return findCasesByUser(userId);
}

export async function getCaseForUser(id: string, userId: string) {
  const caseRecord = await findCaseById(id, userId);
  if (!caseRecord) {
    throw new Error("Case not found.");
  }
  return caseRecord;
}

export async function updateCaseForUser(
  id: string,
  userId: string,
  input: UpdateCaseInput
) {
  const existing = await findCaseById(id, userId);
  if (!existing) {
    throw new Error("Case not found.");
  }
  await updateCase(id, userId, input);
  return findCaseById(id, userId);
}

export async function deleteCaseForUser(id: string, userId: string) {
  const existing = await findCaseById(id, userId);
  if (!existing) {
    throw new Error("Case not found.");
  }
  await deleteCase(id, userId);
}
