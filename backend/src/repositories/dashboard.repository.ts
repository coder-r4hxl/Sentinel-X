import { prisma } from "../lib/prisma.js";

export type DashboardSummary = {
  totalCases: number;
  openCases: number;
  closedCases: number;
  totalEvidence: number;
  analyzedEvidence: number;
  pendingAnalysis: number;
  averageRiskScore: number;
  highRiskEvidence: number;
  recentCases: RecentCase[];
  recentEvidence: RecentEvidence[];
};

export type RecentCase = {
  id: string;
  title: string;
  status: string;
  severity: string;
  createdAt: Date;
};

export type RecentEvidence = {
  id: string;
  label: string;
  fileName: string | null;
  mimeType: string | null;
  caseId: string;
  createdAt: Date;
};

export type ActivityEvent = {
  type: "CASE_CREATED" | "CASE_UPDATED" | "EVIDENCE_ADDED" | "ANALYSIS_COMPLETED";
  label: string;
  entityId: string;
  timestamp: Date;
};

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
  // All case ids belonging to this user — used to scope evidence queries
  const userCases = await prisma.case.findMany({
    where: { userId },
    select: {
      id: true,
      status: true,
      title: true,
      severity: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const caseIds = userCases.map((c) => c.id);
  const totalCases = userCases.length;
  const openCases = userCases.filter((c) => c.status === "OPEN" || c.status === "IN_PROGRESS").length;
  const closedCases = userCases.filter((c) => c.status === "RESOLVED" || c.status === "CLOSED").length;

  const recentCases: RecentCase[] = userCases.slice(0, 5).map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    severity: c.severity,
    createdAt: c.createdAt,
  }));

  if (caseIds.length === 0) {
    return {
      totalCases,
      openCases,
      closedCases,
      totalEvidence: 0,
      analyzedEvidence: 0,
      pendingAnalysis: 0,
      averageRiskScore: 0,
      highRiskEvidence: 0,
      recentCases,
      recentEvidence: [],
    };
  }

  const [evidenceRows, analysisRows, recentEvidenceRows] = await Promise.all([
    prisma.evidence.findMany({
      where: { caseId: { in: caseIds } },
      select: { id: true },
    }),
    prisma.evidenceAnalysis.findMany({
      where: {
        evidence: { caseId: { in: caseIds } },
      },
      select: {
        status: true,
        riskScore: true,
        evidenceId: true,
      },
    }),
    prisma.evidence.findMany({
      where: { caseId: { in: caseIds } },
      select: {
        id: true,
        label: true,
        fileName: true,
        mimeType: true,
        caseId: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const totalEvidence = evidenceRows.length;
  const analyzedEvidence = analysisRows.filter((a) => a.status === "COMPLETED").length;
  const pendingAnalysis = analysisRows.filter((a) => a.status === "PENDING").length;

  const completedWithScore = analysisRows.filter(
    (a): a is typeof a & { riskScore: number } =>
      a.status === "COMPLETED" && a.riskScore !== null
  );
  const averageRiskScore =
    completedWithScore.length > 0
      ? Math.round(
          completedWithScore.reduce((sum, a) => sum + a.riskScore, 0) /
            completedWithScore.length
        )
      : 0;

  const highRiskEvidence = completedWithScore.filter((a) => a.riskScore >= 70).length;

  const recentEvidence: RecentEvidence[] = recentEvidenceRows.map((e) => ({
    id: e.id,
    label: e.label,
    fileName: e.fileName,
    mimeType: e.mimeType,
    caseId: e.caseId,
    createdAt: e.createdAt,
  }));

  return {
    totalCases,
    openCases,
    closedCases,
    totalEvidence,
    analyzedEvidence,
    pendingAnalysis,
    averageRiskScore,
    highRiskEvidence,
    recentCases,
    recentEvidence,
  };
}

export async function getDashboardActivity(userId: string): Promise<ActivityEvent[]> {
  const userCases = await prisma.case.findMany({
    where: { userId },
    select: { id: true, title: true, createdAt: true, updatedAt: true },
  });

  const caseIds = userCases.map((c) => c.id);

  const events: ActivityEvent[] = [];

  for (const c of userCases) {
    events.push({
      type: "CASE_CREATED",
      label: `Case created: ${c.title}`,
      entityId: c.id,
      timestamp: c.createdAt,
    });

    if (c.updatedAt.getTime() !== c.createdAt.getTime()) {
      events.push({
        type: "CASE_UPDATED",
        label: `Case updated: ${c.title}`,
        entityId: c.id,
        timestamp: c.updatedAt,
      });
    }
  }

  if (caseIds.length > 0) {
    const evidenceRows = await prisma.evidence.findMany({
      where: { caseId: { in: caseIds } },
      select: { id: true, label: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    for (const e of evidenceRows) {
      events.push({
        type: "EVIDENCE_ADDED",
        label: `Evidence added: ${e.label}`,
        entityId: e.id,
        timestamp: e.createdAt,
      });
    }

    const analysisRows = await prisma.evidenceAnalysis.findMany({
      where: {
        status: "COMPLETED",
        evidence: { caseId: { in: caseIds } },
      },
      select: {
        evidenceId: true,
        updatedAt: true,
        evidence: { select: { label: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    for (const a of analysisRows) {
      events.push({
        type: "ANALYSIS_COMPLETED",
        label: `Analysis completed: ${a.evidence.label}`,
        entityId: a.evidenceId,
        timestamp: a.updatedAt,
      });
    }
  }

  events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return events.slice(0, 50);
}
