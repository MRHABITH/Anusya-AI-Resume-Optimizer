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
        <Card className="col-span-full lg:col-span-1 border-0 shadow-lg overflow-hidden flex flex-col">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Activity className="w-5 h-5" />
              ATS Score
            </CardTitle>
            <CardDescription className="text-teal-100">
              Estimated compatibility score.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-grow flex flex-col items-center justify-center bg-teal-50/30">
            <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-white shadow-lg border-8 border-teal-100">
               <div className="text-center">
                 <span className={`text-4xl font-bold ${analysis.atsScore >= 80 ? 'text-green-600' : analysis.atsScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                   {analysis.atsScore}
                 </span>
                 <div className="text-xs text-gray-400 font-medium">/ 100</div>
               </div>
            </div>
            <p className="mt-4 text-sm text-center text-gray-600 font-medium px-4">
              {analysis.atsScore >= 80 ? "Excellent! Your resume is well-optimized for ATS." : 
               analysis.atsScore >= 60 ? "Good start, but there's room for improvement." : 
               "Needs significant optimization to pass ATS filters."}
            </p>
          </CardContent>
        </Card>

        {/* Resume Overview */}
        <Card className="col-span-full lg:col-span-2 border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-5 h-5" />
              Resume Overview
            </CardTitle>
            <CardDescription className="text-blue-100">
              Extracted key information from your resume.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-500" />
                  Skills Found
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.skills.length > 0 ? (
                    data.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium transition-colors hover:bg-blue-100">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 italic">No specific skills detected.</span>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                  <Key className="w-4 h-4 text-green-500" />
                  Keywords Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.length > 0 ? (
                    data.keywords.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-medium transition-colors hover:bg-green-100">
                        {kw}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500 italic">No keywords detected.</span>
                  )}
                </div>
              </div>
            </div>
            
            {(data.education.length > 0 || data.experience.length > 0) && (
               <div className="pt-4 border-t border-gray-100 grid gap-6 md:grid-cols-2">
                  {data.experience.length > 0 && (
                    <div className="text-sm">
                      <h4 className="font-semibold text-gray-700 mb-1">Experience Snapshot</h4>
                      <p className="text-gray-600 line-clamp-3">{data.experience[0]}</p>
                    </div>
                  )}
                  {data.education.length > 0 && (
                    <div className="text-sm">
                      <h4 className="font-semibold text-gray-700 mb-1">Education Snapshot</h4>
                      <p className="text-gray-600 line-clamp-3">{data.education[0]}</p>
                    </div>
                  )}
               </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Summary */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Lightbulb className="w-5 h-5" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-purple-50/30">
          <p className="text-gray-700 leading-relaxed text-lg break-words">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>


      {/* Optimization Suggestions */}
      <Card className="border-0 shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="w-5 h-5" />
            Optimization Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2 text-red-700 bg-red-50 p-2 rounded-lg inline-block">
                <AlertTriangle className="w-4 h-4" />
                Missing Key Skills
              </h4>
              {analysis.missingSkills.length > 0 ? (
                <ul className="space-y-2">
                  {analysis.missingSkills.map((skill, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {skill}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No critical missing skills identified.</p>
              )}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg inline-block">
                <CheckCircle2 className="w-4 h-4" />
                Recommended Improvements
              </h4>
              <ul className="space-y-2">
                {analysis.improvements.map((imp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700 p-2 rounded hover:bg-gray-50 transition-colors break-words">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {analysis.rewrittenBullets.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Rewritten Bullet Points
              </h4>
              <div className="grid gap-4 md:grid-cols-2">
                {analysis.rewrittenBullets.map((bullet, i) => (
                  <div key={i} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl text-sm border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <p className="text-gray-700 italic">"{bullet}"</p>
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
