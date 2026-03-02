"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeData, AnalysisResult } from "@/types";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface ResumeChatbotProps {
    resumeData?: ResumeData;
    analysis?: AnalysisResult;
}

export function ResumeChatbot({ resumeData, analysis }: ResumeChatbotProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hello! I am GoGenix, your AI career assistant. Ask me anything about job suggestions, skill gaps, or how to improve your career trajectory!"
        }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [groqApiKey, setGroqApiKey] = useState("");
    const [isKeySet, setIsKeySet] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedKey = localStorage.getItem("gogenix_groq_api_key");
        if (storedKey) {
            setGroqApiKey(storedKey);
            setIsKeySet(true);
        }
    }, []);

    const handleSetKey = () => {
        if (groqApiKey.trim().startsWith("gsk_")) {
            localStorage.setItem("gogenix_groq_api_key", groqApiKey.trim());
            setIsKeySet(true);
        } else {
            alert("Please enter a valid Groq API Key starting with 'gsk_'");
        }
    };

    const handleClearKey = () => {
        localStorage.removeItem("gogenix_groq_api_key");
        setGroqApiKey("");
        setIsKeySet(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: [...messages, userMessage].filter(m => m.role !== "system"),
                    resumeData: resumeData && analysis ? {
                        basics: resumeData,
                        analysis: analysis
                    } : null,
                    groqApiKey: groqApiKey
                }),
            });

            if (!res.ok) throw new Error("Failed to send message");

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "Sorry, my neural link is currently experiencing interference. Please try again." }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                {!isOpen ? (
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 border-none shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-110 flex items-center justify-center animate-pulse"
                    >
                        <Sparkles className="w-8 h-8" />
                    </Button>
                ) : (
                    <div className="flex flex-col w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-slate-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)] overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-slate-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30">
                                    <Bot className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-cyan-50 flex items-center gap-2">
                                        GoGenix AI
                                        <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]" />
                                        <span className="text-xs font-medium text-cyan-400/70 tracking-widest uppercase">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {isKeySet && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleClearKey}
                                        className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-xs px-2 h-8"
                                    >
                                        Clear API Key
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsOpen(false)}
                                    className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {!isKeySet ? (
                            <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-6">
                                <div className="p-4 rounded-full bg-cyan-500/20 border border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                    <Bot className="w-10 h-10 text-cyan-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-cyan-50">API Key Required</h3>
                                    <p className="text-sm text-slate-400 font-light max-w-[250px] mx-auto">
                                        Please provide your Groq API key to initialize the neural link. Your key is stored locally and never sent to our servers.
                                    </p>
                                </div>
                                <div className="w-full space-y-3">
                                    <input
                                        type="password"
                                        value={groqApiKey}
                                        onChange={(e) => setGroqApiKey(e.target.value)}
                                        placeholder="gsk_..."
                                        className="w-full bg-slate-900/50 border border-cyan-500/30 rounded-full px-5 py-3 text-sm text-cyan-50 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/60 transition-all shadow-inner text-center"
                                        onKeyDown={(e) => e.key === "Enter" && handleSetKey()}
                                    />
                                    <Button
                                        onClick={handleSetKey}
                                        disabled={!groqApiKey.trim()}
                                        className="w-full rounded-full bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all font-bold"
                                    >
                                        Connect
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-3.5 text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                                    ? "bg-cyan-600/20 text-cyan-50 border border-cyan-500/30 rounded-2xl rounded-tr-md"
                                                    : "bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-2xl rounded-tl-md"
                                                    }`}
                                            >
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-md p-3 text-cyan-400 flex items-center gap-2 shadow-sm">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-sm font-medium">Processing request...</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-cyan-500/20 bg-slate-800/80">
                                    <div className="flex items-center gap-2 relative">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                            placeholder="Ask about your career..."
                                            className="flex-1 bg-slate-900/50 border border-cyan-500/30 rounded-full px-5 py-3 text-sm text-cyan-50 placeholder-cyan-500/50 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/60 transition-all shadow-inner"
                                        />
                                        <Button
                                            onClick={handleSend}
                                            disabled={isLoading || !input.trim()}
                                            size="sm"
                                            className="rounded-full w-11 h-11 bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-50 transition-colors shrink-0 shadow-lg shadow-cyan-500/20"
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.4);
        }
      `}</style>
        </>
    );
}
