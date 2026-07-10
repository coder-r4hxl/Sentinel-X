import {
  getDashboardSummary,
  getDashboardActivity,
} from "../repositories/dashboard.repository.js";

export async function fetchDashboardSummary(userId: string) {
  return getDashboardSummary(userId);
}

export async function fetchDashboardActivity(userId: string) {
  return getDashboardActivity(userId);
}
