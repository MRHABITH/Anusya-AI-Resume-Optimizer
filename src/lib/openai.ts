import OpenAI from "openai";
import { ResumeData, AnalysisResult } from "@/types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function analyzeResumeWithAI(text: string): Promise<{ data: ResumeData; analysis: AnalysisResult }> {
  // If no API key is present, fallback immediately
  if (!openai) {
    console.warn("OpenAI API key not found. Using mock data.");
    return getMockAnalysis(text);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert resume analyzer and career coach. Your task is to extract structured data from a resume text and provide optimization suggestions.
          
          Return a JSON object with the following structure:
          {
            "data": {
              "skills": ["skill1", "skill2"],
              "experience": ["experience summary 1", "experience summary 2"],
              "education": ["education 1", "education 2"],
              "keywords": ["keyword1", "keyword2"]
            },
            "analysis": {
              "improvements": ["suggestion 1", "suggestion 2"],
              "missingSkills": ["missing skill 1", "missing skill 2"],
              "rewrittenBullets": ["improved bullet point 1", "improved bullet point 2"],
              "summary": "A brief summary of the resume's strengths and weaknesses.",
              "atsScore": 85
            }
          }
          
          Ensure the output is valid JSON. Do not include markdown formatting.`
        },
        {
          role: "user",
          content: `Analyze the following resume text:\n\n${text.substring(0, 3000)}` // Limit text length to avoid token limits
        }
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No response from AI");
    
    // Clean up potential markdown code blocks
    const jsonString = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(jsonString);
    
    // Ensure atsScore exists (backward compatibility if AI forgets it)
    if (typeof result.analysis.atsScore !== 'number') {
      result.analysis.atsScore = calculateMockATSScore(text, result.data.skills);
    }
    
    return result;

  } catch (error: any) {
    // Specifically handle 429 (Quota Exceeded) or generally any API error
    if (error?.status === 429) {
      console.warn("OpenAI Quota Exceeded. Falling back to mock analysis.");
    } else {
      console.error("OpenAI analysis failed:", error);
    }
    // Fallback to mock data for a seamless user experience
    return getMockAnalysis(text);
  }
}

function calculateMockATSScore(text: string, foundSkills: string[]): number {
  let score = 50; // Base score
  
  if (foundSkills.length > 5) score += 10;
  if (foundSkills.length > 10) score += 10;
  
  if (text.toLowerCase().includes("experience") || text.toLowerCase().includes("work history")) score += 10;
  if (text.toLowerCase().includes("education") || text.toLowerCase().includes("degree")) score += 10;
  
  // Length check
  if (text.length > 1000) score += 5;
  if (text.length > 2000) score += 5;
  
  return Math.min(score, 100);
}

function getMockAnalysis(text: string): { data: ResumeData; analysis: AnalysisResult } {
  const lowerText = text.toLowerCase();
  
  // Expanded skill dictionary for better detection across sectors
  const commonSkills = [
    // Tech
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C++", "C#", "Go", "Rust",
    "HTML", "CSS", "Tailwind", "Bootstrap", "SQL", "NoSQL", "MongoDB", "PostgreSQL",
    "Git", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux", "Agile", "Scrum",
    "Figma", "Adobe XD", "UI/UX", "Machine Learning", "Data Science", "TensorFlow", "PyTorch",
    "Jira", "Trello", "Slack", "Zoom", "Google Meet",
    // Business / Management
    "Communication", "Leadership", "Project Management", "Problem Solving", "Teamwork",
    "Strategic Planning", "Business Analysis", "Risk Management", "Budgeting", "Negotiation",
    "Public Speaking", "Time Management", "Stakeholder Management",
    // Marketing / Sales
    "Marketing", "Sales", "Digital Marketing", "Social Media", "SEO", "SEM", "Content Marketing", "Google Analytics", "CRM",
    "Salesforce", "HubSpot", "Copywriting", "Email Marketing", "Brand Management", "Market Research",
    // Finance / Accounting
    "Finance", "Accounting", "Excel", "Financial Analysis", "Bookkeeping", "Taxation", "Auditing",
    "QuickBooks", "SAP", "Financial Modeling", "Investment Management",
    // Healthcare
    "Healthcare", "Nursing", "Patient Care", "Medical Coding", "EMR", "EHR", "Clinical Research",
    "Public Health", "Healthcare Management", "CPR", "First Aid",
    // Education
    "Education", "Teaching", "Curriculum Development", "Instructional Design", "Classroom Management", "E-Learning",
    "Mentoring", "Educational Technology"
  ];

  const foundSkills = commonSkills.filter(skill => lowerText.includes(skill.toLowerCase()));
  
  // Improved section extraction (heuristic)
  // We look for the section header and take a chunk of text after it
  const experienceMatch = text.match(/(?:Experience|Work History|Employment|Professional History)([\s\S]{100,800})/i);
  const educationMatch = text.match(/(?:Education|Academic|Degree|University|College)([\s\S]{50,400})/i);
  const projectsMatch = text.match(/(?:Projects|Portfolio|Key Projects)([\s\S]{50,400})/i);
  
  // Extract a snippet for display, cleaning up newlines
  const experienceSnippet = experienceMatch 
    ? experienceMatch[1].trim().split(/\n{2,}/)[0].substring(0, 200) + "..."
    : null;
    
  const educationSnippet = educationMatch 
    ? educationMatch[1].trim().split(/\n{2,}/)[0].substring(0, 150) + "..."
    : null;

  const experience = experienceSnippet ? [experienceSnippet] : [];
  const education = educationSnippet ? [educationSnippet] : [];

  // Dynamic improvements based on findings
  const improvements = [];
  
  if (foundSkills.length < 5) {
    improvements.push("Add more technical skills to your resume to pass ATS filters.");
  } else if (foundSkills.length < 10) {
    improvements.push("Consider adding more specific tools and technologies you are familiar with.");
  }

  if (!lowerText.includes("achieved") && !lowerText.includes("improved") && !lowerText.includes("increased")) {
    improvements.push("Use more action verbs and quantify results (e.g., 'Improved performance by 20%').");
  }
  
  if (experience.length === 0) {
    improvements.push("Ensure your 'Experience' section is clearly labeled with standard headings like 'Work Experience'.");
  } else if (experienceMatch && experienceMatch[1].length < 200) {
    improvements.push("Expand on your work experience. Describe your responsibilities and achievements in detail.");
  }

  if (education.length === 0) {
    improvements.push("Ensure your 'Education' section is clearly labeled.");
  }

  // Suggest Projects/Portfolio for Tech, Design, and Marketing
  if (!projectsMatch) {
    if (foundSkills.some(s => ["React", "Python", "Java", "C++", "Go", "Rust"].includes(s))) {
      improvements.push("Consider adding a 'Projects' section to showcase your practical application of skills.");
    } else if (foundSkills.some(s => ["Figma", "Adobe XD", "UI/UX", "Marketing", "Content Marketing"].includes(s))) {
      improvements.push("Consider adding a 'Portfolio' or 'Key Projects' section to showcase your work.");
    }
  }
  
  if (text.length < 500) {
    improvements.push("Your resume seems very short. Add more details about your roles and projects.");
  }

  // Dynamic missing skills suggestion
  const missingSkills = [];
  
  // Tech Recommendations
  if (foundSkills.includes("React") && !foundSkills.includes("Redux") && !foundSkills.includes("Context") && !foundSkills.includes("Zustand")) missingSkills.push("State Management (Redux/Zustand)");
  if (foundSkills.includes("Node.js") && !foundSkills.includes("Express") && !foundSkills.includes("NestJS")) missingSkills.push("Express.js/NestJS");
  if (foundSkills.includes("Python") && !foundSkills.includes("Django") && !foundSkills.includes("Flask") && !foundSkills.includes("FastAPI")) missingSkills.push("Django/Flask/FastAPI");
  if (foundSkills.some(s => ["JavaScript", "Python", "Java", "C++"].includes(s)) && !foundSkills.includes("Git")) missingSkills.push("Git/Version Control");
  
  // Marketing Recommendations
  if (foundSkills.some(s => ["Social Media", "Content Marketing", "Copywriting"].includes(s)) && !foundSkills.includes("SEO")) missingSkills.push("SEO/SEM Fundamentals");
  if (foundSkills.some(s => ["Marketing", "Digital Marketing"].includes(s)) && !foundSkills.includes("Google Analytics")) missingSkills.push("Data Analytics (Google Analytics)");

  // Finance Recommendations
  if (foundSkills.some(s => ["Accounting", "Finance"].includes(s)) && !foundSkills.includes("Excel")) missingSkills.push("Advanced Excel");
  if (foundSkills.some(s => ["Accounting"].includes(s)) && !foundSkills.includes("QuickBooks") && !foundSkills.includes("SAP")) missingSkills.push("Accounting Software (QuickBooks/SAP)");

  // Healthcare Recommendations
  if (foundSkills.some(s => ["Nursing", "Patient Care"].includes(s)) && !foundSkills.includes("EMR")) missingSkills.push("EMR/EHR Systems");

  // General Professional Recommendations
  if (foundSkills.length > 0 && !foundSkills.includes("Communication") && !foundSkills.includes("Leadership")) missingSkills.push("Soft Skills (Communication/Leadership)");

  // Generate dynamic rewritten bullets
  // We'll create suggestions based on found skills to simulate "rewriting"
  const rewrittenBullets = [];
  
  // Tech
  if (foundSkills.includes("React")) {
    rewrittenBullets.push("Developed reusable, responsive React components, improving UI consistency by 30%.");
  }
  if (foundSkills.includes("Node.js") || foundSkills.includes("Express")) {
    rewrittenBullets.push("Architected scalable RESTful APIs using Node.js and Express, handling 10k+ concurrent requests.");
  }
  
  // Marketing
  if (foundSkills.some(s => ["Marketing", "Social Media", "SEO"].includes(s))) {
    rewrittenBullets.push("Executed a targeted social media campaign that increased engagement by 40% and follower count by 2,000 within 3 months.");
    rewrittenBullets.push("Optimized website content for SEO, resulting in a 25% increase in organic traffic.");
  }

  // Finance
  if (foundSkills.some(s => ["Finance", "Accounting", "Excel"].includes(s))) {
    rewrittenBullets.push("Streamlined financial reporting processes using advanced Excel macros, reducing monthly closing time by 20%.");
  }

  // Healthcare
  if (foundSkills.some(s => ["Nursing", "Patient Care"].includes(s))) {
    rewrittenBullets.push("Provided high-quality patient care in a fast-paced environment, consistently maintaining a 98% patient satisfaction score.");
  }

  // Management / General
  if (foundSkills.includes("Project Management") || foundSkills.includes("Leadership")) {
    rewrittenBullets.push("Led a cross-functional team of 5 to deliver the project 2 weeks ahead of schedule.");
  }
  
  // If no specific skill-based bullets, provide generic action-oriented ones
  if (rewrittenBullets.length === 0) {
    rewrittenBullets.push("Collaborated with cross-functional teams to drive project success and meet key objectives.");
    rewrittenBullets.push("Implemented process improvements that increased efficiency and reduced operational costs.");
  }

  // Generate a dynamic summary
  let summary = "Your resume ";
  if (foundSkills.length > 8) {
    summary += "shows a strong professional background with a good variety of skills. ";
  } else if (foundSkills.length > 3) {
    summary += "has a decent foundation of skills but could benefit from more specific industry keywords. ";
  } else {
    summary += "needs more specific professional keywords to stand out. ";
  }

  if (experience.length > 0) {
    summary += "Your experience section is detected, which is great. Focus on quantifying your achievements there. ";
  } else {
    summary += "We couldn't clearly detect an Experience section, which is critical. ";
  }

  if (improvements.length === 0) {
    summary += "Overall, it looks like a solid resume!";
  } else {
    summary += "Review the suggestions below to improve your chances of getting hired.";
  }

  // Calculate ATS Score
  const atsScore = calculateMockATSScore(text, foundSkills);

  return {
    data: {
      skills: foundSkills,
      experience,
      education,
      keywords: foundSkills.slice(0, 5), // Just use top skills as keywords for now
      rawText: text
    },
    analysis: {
      improvements,
      missingSkills,
      rewrittenBullets,
      summary,
      atsScore
    }
  };
}
