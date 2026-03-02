"use client";

import { useState } from "react";
import { Upload, FileText, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onAnalyze: (file: File) => Promise<void>;
  isAnalyzing: boolean;
}

export function UploadZone({ onAnalyze, isAnalyzing }: UploadZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "application/pdf" || file.type.includes("word") || file.type.includes("document")) {
      setFile(file);
    } else {
      alert("Please upload a PDF or DOCX file.");
    }
  };

  const handleAnalyze = () => {
    if (file) {
      onAnalyze(file);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.1)] bg-slate-900/40 backdrop-blur-xl overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />
      <CardContent className="flex flex-col items-center justify-center py-10 px-6 md:py-16 md:px-8 space-y-8 relative">
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full min-h-[18rem] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group bg-slate-950/50 backdrop-blur-sm",
            dragActive
              ? "border-cyan-400 bg-cyan-950/30 scale-[1.02] shadow-[0_0_20px_rgba(6,182,212,0.2)]"
              : "border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          {!file ? (
            <div className="flex flex-col items-center space-y-4 text-center p-4">
              <div className="p-5 rounded-full bg-slate-800/50 border border-slate-700 group-hover:bg-cyan-950/50 group-hover:border-cyan-500/30 transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Upload className="w-12 h-12 text-cyan-500" />
              </div>
              <div className="space-y-2">
                <p className="text-xl md:text-2xl font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">
                  Initialize Upload Sequence
                </p>
                <p className="text-sm font-medium text-slate-500">
                  Drop your PDF or DOCX data crystal here
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="p-5 rounded-full bg-cyan-950 border border-cyan-500/30 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <FileText className="w-12 h-12 text-cyan-400" />
              </div>
              <p className="text-xl font-bold text-cyan-50 mb-1 tracking-wide">
                {file.name}
              </p>
              <p className="text-sm text-cyan-500/70 font-mono font-medium">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-4 text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
              >
                Remove
              </Button>
            </div>
          )}
          <input
            type="file"
            className="hidden"
            id="file-upload"
            accept=".pdf,.docx,.doc,.application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
          {file && (
            <Button
              className="w-full h-14 text-lg font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl border border-cyan-400/50"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin text-cyan-200" />
                  Processing Data...
                </>
              ) : (
                <>
                  Commence Analysis
                  <CheckCircle className="ml-2 h-5 w-5 text-cyan-200" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
