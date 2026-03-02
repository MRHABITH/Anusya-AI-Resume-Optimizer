import { NextRequest, NextResponse } from "next/server";
import { mockJobs } from "@/data/jobs";
import { ResumeData } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { skills, keywords } = (await req.json()) as ResumeData;
    const lowerCaseSkills = skills.map(s => s.toLowerCase());
    const lowerCaseKeywords = keywords.map(k => k.toLowerCase());

    const matchedJobs = mockJobs.map(job => {
      const jobContent = (job.title + " " + job.description).toLowerCase();
      let score = 0;
      let matchedSkillsCount = 0;

      // Title match (high weight)
      lowerCaseSkills.forEach(s => {
        if (job.title.toLowerCase().includes(s)) {
          score += 10;
        }
      });

      // Skill match in description
      const matchedSkillNames: string[] = [];
      lowerCaseSkills.forEach((s, index) => {
        if (jobContent.includes(s)) {
          score += 2;
          matchedSkillsCount++;
          // Use original casing from input skills if possible, or just capitalize
          matchedSkillNames.push(skills[index]);
        }
      });

      // Keyword match
      lowerCaseKeywords.forEach(k => {
        if (jobContent.includes(k)) {
          score += 1;
        }
      });

      return { ...job, score, matchedSkillsCount, matchedSkillNames };
    })
    .filter(j => j.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6); // Top 6 jobs

    // Remove internal scoring properties before returning
    const finalJobs = matchedJobs.map(({ score, matchedSkillsCount, matchedSkillNames, ...job }) => {
      let reason = job.matchReason; // Fallback to static reason
      if (matchedSkillNames.length > 0) {
        const topSkills = matchedSkillNames.slice(0, 3).join(", ");
        reason = `Matches your profile with skills in ${topSkills}${matchedSkillNames.length > 3 ? ", and more" : "."}`;
      } else if (score > 10) {
        reason = "Strong match based on your job title history.";
      }
      
      return {
        ...job,
        matchReason: reason
      };
    });

    return NextResponse.json(finalJobs);
  } catch (error) {
    console.error("Error matching jobs:", error);
    return NextResponse.json(
      { error: "Failed to match jobs" },
      { status: 500 }
    );
  }
}
