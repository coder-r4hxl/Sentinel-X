import type { AssessmentReport, BrowserSnapshot } from '../types';

export interface AdvisorContext {
  report: AssessmentReport | null;
  snapshot: BrowserSnapshot | null;
}

const topicMap: Record<string, string> = {
  fingerprinting: 'Fingerprinting is the process of identifying a browser or device by combining observable signals such as screen size, browser version, timezone, and available APIs.',
  webgl: 'WebGL is a browser API for hardware-accelerated graphics and advanced rendering. It strengthens compatibility for visual workloads and performance-sensitive interfaces.',
  notifications: 'Notifications can improve user guidance and alerts, but they also require explicit browser permission and should be managed carefully for trust and clarity.',
  storage: 'Local storage is a browser feature that helps preserve state, preferences, and session-relevant data for the site.',
  https: 'HTTPS protects data as it moves between the browser and the site by encrypting the connection and reducing interception risk.',
  cookies: 'Cookies help preserve sessions and preferences, but they also influence privacy and tracking surfaces depending on how they are used.',
};

export function getKnowledgeBaseExplanation(question: string) {
  const normalized = question.toLowerCase();
  for (const [topic, explanation] of Object.entries(topicMap)) {
    if (normalized.includes(topic)) return explanation;
  }
  return '';
}

export function buildRecommendationList(context: AdvisorContext) {
  const recommendations: string[] = [];
  const report = context.report;
  const snapshot = context.snapshot;

  if (!report || !snapshot) {
    return ['Run the assessment to receive tailored guidance.'];
  }

  if (report.privacyScore < 75) {
    recommendations.push('Tighten privacy settings and review tracking exposure.');
  }

  if (report.browserSecurityScore < 75) {
    recommendations.push('Review browser hardening, extensions, and update status.');
  }

  if (snapshot.notificationPermission === 'denied') {
    recommendations.push('Re-enable notifications to improve guidance and alert delivery.');
  }

  if (!snapshot.cookiesEnabled) {
    recommendations.push('Re-enable cookies if continuity and session state are important.');
  }

  if (!snapshot.webglSupport) {
    recommendations.push('Use a browser build that exposes WebGL for better compatibility.');
  }

  return recommendations.length ? recommendations : ['The current posture is stable and the assessment did not expose urgent blockers.'];
}

export function getQuickActions() {
  return ['Improve Privacy', 'Improve Security', 'Explain Findings', 'View Report', 'Run Assessment Again'];
}
