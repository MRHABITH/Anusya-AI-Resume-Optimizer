"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { AnalysisDisplay } from "@/components/AnalysisDisplay";
import { JobRecommendations } from "@/components/JobRecommendations";
import { AnalysisResponse, Job } from "@/types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setJobs([]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to analyze resume");
      }

      const result: AnalysisResponse = await res.json();
      setAnalysisResult(result);

      // Fetch job recommendations
      const jobRes = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (jobRes.ok) {
        const jobResult: Job[] = await jobRes.json();
        setJobs(jobResult);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setJobs([]);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="container relative mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center justify-center text-center mb-12 space-y-4">
          <div className="inline-block p-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg mb-4 animate-in fade-in zoom-in duration-500">
            <div className="bg-white dark:bg-gray-900 rounded-[14px] px-4 py-1">
              <span className="text-xs font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 uppercase">
                GoGenix-AI Powered Resume Analysis
              </span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 pb-2 animate-in slide-in-from-bottom-4 duration-700">
            Resume Optimizer
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300 animate-in slide-in-from-bottom-5 duration-700 delay-150">
            Unlock your career potential with AI-driven resume analysis and personalized job recommendations.
          </p>
        </div>

        <div className="w-full max-w-5xl mx-auto space-y-8 relative z-10">
          {!analysisResult && (
            <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <UploadZone onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-center animate-in fade-in slide-in-from-top-4 shadow-sm">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex flex-col md:flex-row justify-between items-center bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm gap-4 text-center md:text-left">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                  <p className="text-gray-500">Here's what we found in your resume</p>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full md:w-auto gap-2 hover:bg-gray-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Analyze Another
                </Button>
              </div>

              <AnalysisDisplay data={analysisResult.data} analysis={analysisResult.analysis} />

              <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                <JobRecommendations jobs={jobs} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-8 mt-12 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200/50 dark:border-gray-800/50 relative z-10">
        © 2026.Anusuya and team reserved all rights 
      </footer>
    </main>
  );
}
