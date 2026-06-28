import { detectBrowserInfo } from './browserService';
import { generateAdvisorReply, type AdvisorContext, type AdvisorReply } from './advisorEngine';
import { buildRecommendationList } from './knowledgeBase';
import { useAssessmentStore } from '@/store/assessmentStore';

export interface AdvisorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export function getAdvisorContext(): AdvisorContext {
  return {
    report: useAssessmentStore.getState().report,
    snapshot: detectBrowserInfo(),
  };
}

export function getAdvisorReply(question: string): AdvisorReply {
  return generateAdvisorReply(question, getAdvisorContext());
}

export function getAdvisorSummary() {
  const context = getAdvisorContext();
  const report = context.report;

  if (!report) {
    return {
      score: 0,
      risk: 'Unknown',
      recommendations: buildRecommendationList(context),
      findings: ['Run the assessment to generate insights.'],
    };
  }

  return {
    score: Math.round((report.browserSecurityScore + report.privacyScore + report.compatibilityScore) / 3),
    risk: report.riskRating,
    recommendations: buildRecommendationList(context),
    findings: report.findings.slice(0, 4),
  };
}
