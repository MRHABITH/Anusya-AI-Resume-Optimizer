export interface ResumeData {
  skills: string[];
  experience: string[];
  education: string[];
  keywords: string[];
  rawText?: string;
}

export interface AnalysisResult {
  improvements: string[];
  missingSkills: string[];
  rewrittenBullets: string[];
  summary: string;
  atsScore: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  matchReason: string;
}

export interface AnalysisResponse {
  data: ResumeData;
  analysis: AnalysisResult;
}
