export function computeOverallRisk(score: number): import('../../types/dashboard').RiskLevel {
  if (score >= 90) return 'Excellent';
  if (score >= 78) return 'Good';
  if (score >= 62) return 'Moderate';
  if (score >= 45) return 'High';
  return 'Critical';
}

export function scoreTone(score: number): import('../../types/dashboard').Tone {
  if (score >= 85) return 'good';
  if (score >= 70) return 'info';
  if (score >= 50) return 'warn';
  return 'bad';
}

