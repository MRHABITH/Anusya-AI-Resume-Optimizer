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
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3 text-gray-800 dark:text-gray-100 flex-wrap">
          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md shrink-0">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500">
            Recommended Opportunities
          </span>
        </h2>
        <Badge variant="outline" className="w-fit px-4 py-1.5 text-sm font-medium border-blue-200 text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700 shadow-sm">
          {jobs.length} Matches Found
        </Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <Card 
            key={job.id} 
            className="group flex flex-col hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden ring-1 ring-gray-100 dark:ring-gray-800 bg-white/50 backdrop-blur-sm hover:-translate-y-1"
          >
            <CardHeader className="relative p-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 transition-opacity group-hover:opacity-100" />
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  {index === 0 && (
                    <Badge className="bg-amber-400 text-amber-900 hover:bg-amber-500 border-0 shadow-sm font-bold">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Top Match
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-bold text-white leading-tight mb-2 group-hover:underline decoration-white/30 underline-offset-4">
                  {job.title}
                </CardTitle>
                <p className="text-blue-100 font-medium flex items-center gap-1.5 text-sm">
                  {job.company}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-blue-200 font-medium">
                   <span className="bg-white/10 px-2 py-0.5 rounded">
                     {["Full-time", "Contract", "Remote"][index % 3]}
                   </span>
                   <span>•</span>
                   <span>Posted {Math.floor(Math.random() * 5) + 1} days ago</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 flex-grow">
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100/50">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1 uppercase tracking-wide">
                      Why this fits
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 leading-snug">
                      {job.matchReason}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-6 pt-0 mt-auto grid grid-cols-2 gap-3">
              <Button 
                onClick={() => handleJobSearch(job.title, 'google')}
                variant="outline"
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
              >
                <Search className="w-4 h-4 mr-2" />
                Google
              </Button>
              <Button 
                onClick={() => handleJobSearch(job.title, 'indeed')}
                className="w-full bg-slate-900 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300"
              >
                Apply
                <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-slate-800 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold">Find more real-time vacancies</h3>
            <p className="text-blue-200 max-w-md">
              Search across top job platforms instantly with your matched profile skills.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
             <Button 
               onClick={() => window.open('https://www.indeed.com/', '_blank')}
               className="bg-white text-blue-900 hover:bg-blue-50 font-bold"
             >
               Search Indeed
             </Button>
             <Button 
               onClick={() => window.open('https://www.linkedin.com/jobs/', '_blank')}
               className="bg-[#0077b5] text-white hover:bg-[#006097] font-bold"
             >
               Search LinkedIn
             </Button>
             <Button 
               onClick={() => window.open('https://www.glassdoor.com/Job/index.htm', '_blank')}
               className="bg-[#0caa41] text-white hover:bg-[#0a8a35] font-bold"
             >
               Glassdoor
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
