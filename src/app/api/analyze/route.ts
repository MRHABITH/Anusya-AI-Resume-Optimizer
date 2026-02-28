import { NextRequest, NextResponse } from "next/server";
import { parseResume } from "@/lib/parser";
import { analyzeResumeWithAI } from "@/lib/openai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text = await parseResume(buffer, file.type);
    
    // Analyze text with AI
    const result = await analyzeResumeWithAI(text);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: "Failed to process resume: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
