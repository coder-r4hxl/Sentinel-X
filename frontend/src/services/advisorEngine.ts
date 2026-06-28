import type { AssessmentReport, BrowserSnapshot } from '../types';
import { buildRecommendationList, getKnowledgeBaseExplanation, getQuickActions } from './knowledgeBase';

export interface AdvisorContext {
  report: AssessmentReport | null;
  snapshot: BrowserSnapshot | null;
}

export interface AdvisorReply {
  text: string;
  audioText: string;
  suggestions: string[];
  intent: string;
}

function scoreLabel(score: number) {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'strong';
  if (score >= 60) return 'moderate';
  return 'needs attention';
}

function riskLabel(report: AssessmentReport | null) {
  return report?.riskRating ?? 'Unknown';
}

export function generateAdvisorReply(question: string, context: AdvisorContext): AdvisorReply {
  const normalized = question.toLowerCase();
  const report = context.report;
  const snapshot = context.snapshot;

  if (!report || !snapshot) {
    const fallback = 'The assessment has not produced a report yet. Run the assessment first so I can evaluate your browser posture against the actual data.';
    return {
      text: fallback,
      audioText: fallback,
      suggestions: getQuickActions(),
      intent: 'assessment-needed',
    };
  }

  const securityScore = report.browserSecurityScore;
  const privacyScore = report.privacyScore;
  const compatibilityScore = report.compatibilityScore;
  const overallScore = Math.round((securityScore + privacyScore + compatibilityScore) / 3);
  const notificationState = snapshot.notificationPermission;
  const cookieState = snapshot.cookiesEnabled;
  const webglState = snapshot.webglSupport;
  const storageState = snapshot.localStorage;
  const currentProtocol = typeof window !== 'undefined' ? window.location.protocol : 'unknown';

  if (/(secure|security)/.test(normalized)) {
    const text = `The current assessment reports an overall security posture of ${overallScore}/100 with a ${riskLabel(report)} risk rating. Security is ${scoreLabel(securityScore)} at ${securityScore}/100, and the browser ${webglState ? 'supports' : 'does not currently expose'} WebGL acceleration. ${cookieState ? 'Cookies are enabled, which helps maintain session continuity.' : 'Cookies are disabled, which may affect continuity and some site features.'}`;
    return { text, audioText: text, suggestions: ['Improve Security', 'Explain Findings', 'View Report'], intent: 'security' };
  }

  if (/(why.*low|low score|score low|reason)/.test(normalized)) {
    const reasons = [
      `Security scored ${securityScore}/100`,
      `Privacy scored ${privacyScore}/100`,
      `Compatibility scored ${compatibilityScore}/100`,
      notificationState === 'denied' ? 'Notifications are denied.' : 'Notifications are available.',
      cookieState ? 'Cookies are enabled.' : 'Cookies are disabled.',
    ].filter(Boolean);
    const text = `The score is lower because the strongest signals in the current assessment are ${reasons.join(' ')}. The most relevant issue is ${notificationState === 'denied' ? 'denied notifications' : 'the current permission posture'}, and the assessment also shows ${privacyScore < 75 ? 'privacy controls that should be tightened.' : 'a relatively stable privacy profile.'}`;
    return { text, audioText: text, suggestions: ['Improve Privacy', 'Improve Security', 'Explain Findings'], intent: 'low-score' };
  }

  if (/(privacy|improve privacy)/.test(normalized)) {
    const text = `Privacy currently sits at ${privacyScore}/100. ${snapshot.doNotTrack === '1' ? 'Do Not Track is enabled in the browser profile.' : 'Do Not Track was not detected in the current profile.'} ${storageState ? 'Local storage is available.' : 'Local storage was not detected.'} To improve privacy, focus on reducing exposed permissions and keeping the browser updated. The assessment also indicates ${notificationState === 'denied' ? 'notifications are denied, which reduces prompt exposure.' : 'notifications are available.'}`;
    return { text, audioText: text, suggestions: ['Improve Privacy', 'Explain Findings', 'View Report'], intent: 'privacy' };
  }

  if (/(fingerprint|fingerprinting)/.test(normalized)) {
    const text = `Fingerprinting is the process of identifying a browser or device based on a combination of attributes such as screen size, language, timezone, and available APIs. The current assessment did not report a dedicated fingerprinting mitigation control, so the browser profile remains observable to a degree. ${snapshot.browserName !== 'Unknown' ? `The assessment confirmed ${snapshot.browserName} with ${snapshot.platform}.` : 'The browser identity was not fully resolved.'}`;
    return { text, audioText: text, suggestions: ['Improve Privacy', 'Explain Findings', 'View Report'], intent: 'fingerprinting' };
  }

  if (/(webgl)/.test(normalized)) {
    const text = `WebGL is a graphics API that enables accelerated rendering and visual workloads in the browser. ${webglState ? 'This browser currently exposes WebGL support, which is a positive compatibility signal.' : 'WebGL support was not detected, so some visual or hardware-accelerated features may be unavailable.'} This directly affects the compatibility portion of the assessment.`;
    return { text, audioText: text, suggestions: ['Explain Findings', 'Improve Security', 'View Report'], intent: 'webgl' };
  }

  if (/(notification|notifications)/.test(normalized)) {
    const text = `The assessment recorded notification permission as ${notificationState}. ${notificationState === 'denied' ? 'That means alerts and in-session prompts may be suppressed in this environment.' : 'The browser is allowing notifications, which supports richer guidance and prompts.'}`;
    return { text, audioText: text, suggestions: ['Improve Security', 'View Report', 'Run Assessment Again'], intent: 'notifications' };
  }

  if (/(local storage|storage)/.test(normalized)) {
    const text = `Local storage is ${storageState ? 'available' : 'not available'} in the current browser context. ${storageState ? 'That supports session persistence and offline-friendly features.' : 'This may limit persistence and some site features.'}`;
    return { text, audioText: text, suggestions: ['Improve Privacy', 'Explain Findings', 'View Report'], intent: 'storage' };
  }

  if (/(https|tls|encrypt|encryption)/.test(normalized)) {
    const text = `HTTPS protects data in transit by encrypting traffic between the browser and the site. The current page is running on ${currentProtocol === 'https:' ? 'HTTPS' : 'a non-HTTPS protocol'}. When HTTPS is in place, it helps reduce interception and tampering during transmission.`;
    return { text, audioText: text, suggestions: ['Improve Security', 'View Report', 'Explain Findings'], intent: 'https' };
  }

  if (/(cookie|cookies)/.test(normalized)) {
    const text = `The assessment recorded cookies as ${cookieState ? 'enabled' : 'disabled'}. Cookies can support session continuity, but they also affect privacy and tracking surfaces. ${cookieState ? 'They are currently helping preserve site state.' : 'Disabling them may reduce continuity but can also limit tracking.'}`;
    return { text, audioText: text, suggestions: ['Improve Privacy', 'Explain Findings', 'View Report'], intent: 'cookies' };
  }

  if (/(findings|recommend|explain)/.test(normalized)) {
    const text = `The latest assessment findings are ${report.findings.join(' ')}. I can also explain each signal in more detail if you want a deeper breakdown.`;
    return { text, audioText: text, suggestions: ['Explain Findings', 'Improve Security', 'View Report'], intent: 'findings' };
  }

  const knowledgeText = getKnowledgeBaseExplanation(normalized);
  const recommendations = buildRecommendationList(context);
  const text = knowledgeText || `Your assessment shows ${overallScore}/100 overall with ${riskLabel(report)} risk. ${recommendations[0] ?? 'The current findings suggest a stable but improvable posture.'}`;
  return { text, audioText: text, suggestions: recommendations.slice(0, 4), intent: 'general' };
}
