/**
 * CiviLens AI — Shared Types
 */

export interface AnalysisResult {
  /** Plain-language summary of the document */
  simpleExplanation: string;
  /** 3–6 key takeaways */
  keyPoints: string[];
  /** Risk warnings (empty array = no risks) */
  riskWarnings: string[];
  /** Actionable advice items */
  practicalAdvice: string[];
  /** AI-detected document title / label */
  documentTitle: string;
  /** Detected category: Legal, Financial, Government, Educational, Employment, or General */
  category: string;
  /** Overall risk level derived from warnings */
  riskLevel: 'Low' | 'Medium' | 'High' | 'None';
}

export interface AnalysisHistoryItem {
  id: string;
  userId: string;
  /** First 200 chars of the original input */
  inputPreview: string;
  result: AnalysisResult;
  createdAt: Date;
}
