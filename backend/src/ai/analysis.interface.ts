export type EvidenceInput = {
  id: string;
  label: string;
  description: string | null;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
};

export type AnalysisResult = {
  summary: string;
  findings: string[];
  riskScore: number;
};

export interface AnalysisProvider {
  analyze(evidence: EvidenceInput): Promise<AnalysisResult>;
}
