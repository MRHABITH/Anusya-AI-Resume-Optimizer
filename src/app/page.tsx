"use client";

import { useState } from "react";
import { UploadZone } from "@/components/UploadZone";
import { AnalysisDisplay } from "@/components/AnalysisDisplay";
import { JobRecommendations } from "@/components/JobRecommendations";
import { AnalysisResponse, Job } from "@/types";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ResumeChatbot } from "@/components/ResumeChatbot";

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
    <main className="min-h-screen bg-[#020617] text-slate-200 relative overflow-hidden">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px] mix-blend-screen pointer-events-none"></div>

      <div className="container relative mx-auto px-4 py-12 md:py-20 z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-sm font-medium tracking-wide uppercase animate-in fade-in zoom-in duration-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            GoGenix-AI Neural Analysis
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 pb-2 animate-in slide-in-from-bottom-4 duration-700 drop-shadow-sm">
            Resume Core
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-slate-400 animate-in slide-in-from-bottom-5 duration-700 delay-150 font-light">
            Upload your data crystal. Our AI will analyze your trajectory, optimize your skill matrix, and chart your career path.
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
              <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] gap-4 text-center md:text-left">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-50">Analysis Complete</h2>
                  <p className="text-cyan-500/70 font-medium">Neural processing finished. Results compiled.</p>
                </div>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full md:w-auto gap-2 bg-slate-800 border-cyan-500/30 text-cyan-400 hover:bg-cyan-950 hover:text-cyan-300 transition-all shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Analysis
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
      <footer className="w-full text-center py-8 mt-12 text-sm text-slate-500 border-t border-slate-800/50 relative z-10 font-mono">
        © 2026. Anusuya and her team. All rights reserved.
      </footer>

      <ResumeChatbot
        resumeData={analysisResult?.data}
        analysis={analysisResult?.analysis}
      />
    </main>
  );
}
