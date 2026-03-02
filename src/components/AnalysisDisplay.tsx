import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResumeData, AnalysisResult } from "@/types";
import { CheckCircle2, AlertTriangle, Lightbulb, User, Award, Key, Activity } from "lucide-react";

interface AnalysisDisplayProps {
  data: ResumeData;
  analysis: AnalysisResult;
}

export function AnalysisDisplay({ data, analysis }: AnalysisDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* ATS Score */}
        <Card className="col-span-full lg:col-span-1 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] bg-slate-900/60 backdrop-blur-xl overflow-hidden flex flex-col rounded-2xl">
          <CardHeader className="bg-slate-800/50 border-b border-cyan-500/10">
            <CardTitle className="flex items-center gap-2 text-xl text-cyan-400">
              <Activity className="w-5 h-5" />
              System Match Score
            </CardTitle>
            <CardDescription className="text-slate-400">
              Algorithm compatibility quotient.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-grow flex flex-col items-center justify-center bg-transparent">
            <div className="relative w-36 h-36 flex items-center justify-center rounded-full bg-slate-950 shadow-[0_0_30px_rgba(6,182,212,0.1)] border border-cyan-500/30">
              <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" style={{ animationDuration: '3s' }}></div>
              <div className="text-center z-10">
                <span className={`text-5xl font-black ${analysis.atsScore >= 80 ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : analysis.atsScore >= 60 ? 'text-blue-400' : 'text-purple-400'}`}>
                  {analysis.atsScore}
                </span>
                <div className="text-xs text-slate-500 font-mono mt-1 tracking-widest uppercase">/ 100</div>
              </div>
            </div>
            <p className="mt-6 text-sm text-center text-slate-300 font-medium px-4 leading-relaxed">
              {analysis.atsScore >= 80 ? "Optimal alignment detected. Systems are go." :
                analysis.atsScore >= 60 ? "Acceptable correlation. Minor optimizations required." :
                  "Low correlation index. Significant recalibration advised."}
            </p>
          </CardContent>
        </Card>

        {/* Resume Overview */}
        <Card className="col-span-full lg:col-span-2 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] bg-slate-900/60 backdrop-blur-xl overflow-hidden rounded-2xl">
          <CardHeader className="bg-slate-800/50 border-b border-blue-500/10">
            <CardTitle className="flex items-center gap-2 text-xl text-blue-400">
              <User className="w-5 h-5" />
              Data Profile Overview
            </CardTitle>
            <CardDescription className="text-slate-400">
              Extracted vectors from your data packet.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide text-xs">
                  <Award className="w-4 h-4 text-blue-400" />
                  Skill Matrix
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.skills.length > 0 ? (
                    data.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-md text-xs font-medium transition-colors hover:bg-blue-500/20">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 italic font-mono">No nodes linked.</span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-slate-300 flex items-center gap-2 uppercase tracking-wide text-xs">
                  <Key className="w-4 h-4 text-emerald-400" />
                  Key Vectors
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.length > 0 ? (
                    data.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-md text-xs font-medium transition-colors hover:bg-emerald-500/20">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500 italic font-mono">No vectors aligned.</span>
                  )}
                </div>
              </div>
            </div>

            {(data.education.length > 0 || data.experience.length > 0) && (
              <div className="pt-4 border-t border-slate-700/50 grid gap-6 md:grid-cols-2">
                {data.experience.length > 0 && (
                  <div className="text-sm">
                    <h4 className="font-bold text-slate-300 mb-1 uppercase tracking-wide text-xs">Experience Log</h4>
                    <p className="text-slate-400 line-clamp-3 font-light">{data.experience[0]}</p>
                  </div>
                )}
                {data.education.length > 0 && (
                  <div className="text-sm">
                    <h4 className="font-bold text-slate-300 mb-1 uppercase tracking-wide text-xs">Education Nexus</h4>
                    <p className="text-slate-400 line-clamp-3 font-light">{data.education[0]}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      <Card className="border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)] bg-slate-900/60 backdrop-blur-xl overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-800/50 border-b border-purple-500/10">
          <CardTitle className="flex items-center gap-2 text-xl text-purple-400">
            <Lightbulb className="w-5 h-5" />
            Neural Network Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-slate-300 leading-relaxed text-lg break-words font-light">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>


      {/* Optimization Suggestions */}
      <Card className="border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.1)] bg-slate-900/60 backdrop-blur-xl overflow-hidden rounded-2xl">
        <CardHeader className="bg-slate-800/50 border-b border-orange-500/10">
          <CardTitle className="flex items-center gap-2 text-xl text-orange-400">
            <AlertTriangle className="w-5 h-5" />
            Optimization Directives
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg inline-block text-sm uppercase tracking-wide">
                <AlertTriangle className="w-4 h-4" />
                Critical Missing Nodes
              </h4>
              {analysis.missingSkills.length > 0 ? (
                <ul className="space-y-2">
                  {analysis.missingSkills.map((skill, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-300 p-2 rounded hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 shadow-[0_0_5px_#ef4444]" />
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-slate-500 italic font-mono">No critical missing nodes identified.</p>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-bold flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg inline-block text-sm uppercase tracking-wide">
                <CheckCircle2 className="w-4 h-4" />
                Recommended Protocols
              </h4>
              <ul className="space-y-2">
                {analysis.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 p-2 rounded hover:bg-slate-800/50 transition-colors break-words border border-transparent hover:border-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {analysis.rewrittenBullets.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-700/50">
              <h4 className="font-bold mb-4 text-slate-200 flex items-center gap-2 uppercase tracking-wide text-sm">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Optimized Data Blocks
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.rewrittenBullets.map((bullet, i) => (
                  <div key={i} className="p-4 bg-slate-800/50 rounded-xl text-sm border border-slate-700 shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-shadow">
                    <p className="text-slate-300 font-light italic">"{bullet}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
