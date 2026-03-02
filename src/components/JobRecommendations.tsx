import { Job } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Building2, CheckCircle2, ArrowRight, Star, ExternalLink, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobRecommendationsProps {
  jobs: Job[];
}

export function JobRecommendations({ jobs }: JobRecommendationsProps) {
  if (jobs.length === 0) {
    return null;
  }

  const handleJobSearch = (query: string, platform: 'google' | 'indeed' | 'linkedin') => {
    let url = '';
    const encodedQuery = encodeURIComponent(query + " jobs");

    switch (platform) {
      case 'google':
        url = `https://www.google.com/search?q=${encodedQuery}&ibp=htl;jobs`;
        break;
      case 'indeed':
        url = `https://www.indeed.com/jobs?q=${encodedQuery}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/jobs/search/?keywords=${encodedQuery}`;
        break;
    }

    window.open(url, '_blank');
  };

  return (
    <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-slate-200 flex-wrap">
          <div className="p-2.5 bg-slate-800 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.2)] shrink-0">
            <Briefcase className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
            Target Trajectories
          </span>
        </h2>
        <Badge variant="outline" className="w-fit px-4 py-1.5 text-sm font-medium border-cyan-500/30 text-cyan-400 bg-cyan-950/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
          {jobs.length} Nodes Found
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <Card
            key={job.id}
            className="group flex flex-col hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 border border-slate-700/50 shadow-lg overflow-hidden bg-slate-900/50 backdrop-blur-md hover:-translate-y-1 rounded-2xl"
          >
            <CardHeader className="relative p-0 overflow-hidden border-b border-slate-800">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-slate-950/50 border border-slate-700 p-2.5 rounded-xl shadow-inner shadow-cyan-500/10">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  {index === 0 && (
                    <Badge className="bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)] font-bold tracking-wide">
                      <Star className="w-3.5 h-3.5 mr-1.5 fill-cyan-400 text-cyan-400" />
                      Prime Target
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-slate-100 leading-tight mb-2 group-hover:text-cyan-300 transition-colors">
                  {job.title}
                </CardTitle>
                <p className="text-slate-400 font-medium flex items-center gap-1.5 text-sm">
                  {job.company}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-medium font-mono">
                  <span className="bg-slate-800/80 border border-slate-700 px-2 py-1 rounded">
                    {["Full-time", "Contract", "Remote"][index % 3]}
                  </span>
                  <span className="text-cyan-500/50">•</span>
                  <span>T-{Math.floor(Math.random() * 5) + 1} days</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 flex-grow">
              <div className="mb-6">
                <p className="text-sm text-slate-400 font-light line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="bg-slate-950/50 rounded-xl p-4 border border-cyan-500/10 shadow-inner">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-cyan-600 mb-1 tracking-widest uppercase">
                      Alignment Protocol
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">
                      {job.matchReason}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 mt-auto grid grid-cols-2 gap-3 border-t border-slate-800/50 bg-slate-900/20 p-6 pt-4">
              <Button
                onClick={() => handleJobSearch(job.title, 'google')}
                variant="outline"
                className="w-full border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors font-medium"
              >
                <Search className="w-4 h-4 mr-2" />
                Query
              </Button>
              <Button
                onClick={() => handleJobSearch(job.title, 'indeed')}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all font-bold group"
              >
                Execute
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-2xl bg-slate-900 border border-cyan-500/20 text-white shadow-[0_0_40px_rgba(6,182,212,0.1)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
              Deploy Data Collectors
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-2" />
            </h3>
            <p className="text-cyan-500/70 max-w-md font-light">
              Scan major planetary networks instantly using your optimized credential matrix.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => window.open('https://www.indeed.com/', '_blank')}
              className="bg-slate-800 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-950 font-bold tracking-wide"
            >
              Indeed Network
            </Button>
            <Button
              onClick={() => window.open('https://www.linkedin.com/jobs/', '_blank')}
              className="bg-[#0077b5]/20 text-[#0077b5] border border-[#0077b5]/50 hover:bg-[#0077b5]/30 hover:text-white font-bold tracking-wide transition-colors"
            >
              LinkedIn Orbit
            </Button>
            <Button
              onClick={() => window.open('https://www.glassdoor.com/Job/index.htm', '_blank')}
              className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 hover:bg-emerald-500/30 hover:text-white font-bold tracking-wide transition-colors"
            >
              Glassdoor Node
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
