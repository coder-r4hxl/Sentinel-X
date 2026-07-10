import type { AnalysisProvider, AnalysisResult, EvidenceInput } from "./analysis.interface.js";

export class StubAnalysisProvider implements AnalysisProvider {
  async analyze(evidence: EvidenceInput): Promise<AnalysisResult> {
    const labelLower = evidence.label.toLowerCase();

    const riskScore = labelLower.includes("critical")
      ? 90
      : labelLower.includes("high")
        ? 70
        : labelLower.includes("medium")
          ? 50
          : 30;

    return {
      summary: `Stub analysis for evidence "${evidence.label}". Replace StubAnalysisProvider with a real AnalysisProvider implementation.`,
      findings: [
        `Evidence type: ${evidence.mimeType ?? "unknown"}`,
        `File: ${evidence.fileName ?? "no file attached"}`,
        `Size: ${evidence.fileSize != null ? `${evidence.fileSize} bytes` : "unknown"}`,
        `Risk score assigned: ${riskScore}`,
      ],
      riskScore,
    };
  }
}
