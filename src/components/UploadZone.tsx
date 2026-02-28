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
    <Card className="w-full max-w-2xl mx-auto border-0 shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
      <CardContent className="flex flex-col items-center justify-center py-8 px-4 md:py-12 md:px-6 space-y-6 relative">
        <div
          className={cn(
            "flex flex-col items-center justify-center w-full min-h-[16rem] rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
            dragActive 
              ? "border-blue-500 bg-blue-50/50 scale-[1.02]" 
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50/50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          {!file ? (
            <div className="flex flex-col items-center space-y-4 text-center p-4">
              <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors duration-300">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <p className="text-lg md:text-xl font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                  Drag & Drop your resume here
                </p>
                <p className="text-sm text-gray-500">
                  Supports PDF and DOCX formats
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="p-4 rounded-full bg-green-100 mb-4 shadow-sm">
                <FileText className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                {file.name}
              </p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
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
              className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  Analyze Resume
                  <CheckCircle className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
