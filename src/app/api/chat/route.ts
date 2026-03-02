import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export async function POST(req: Request) {
    try {
        const { messages, resumeData, groqApiKey } = await req.json();

        if (!groqApiKey) {
            return NextResponse.json({ error: 'Groq API Key is required' }, { status: 401 });
        }

        const groq = new Groq({
            apiKey: groqApiKey,
        });

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
        }

        const systemPrompt = `You are an advanced futuristic career AI assistant named GoGenix.
You provide highly actionable, futuristic, and forward-thinking career advice.
If the user's resume data is provided below, use it to personalize job suggestions, skill updates, and career trajectory advice. Keep your answers concise, professional, yet slightly sci-fi themed (e.g. using terms like 'optimizing trajectory', 'skill matrix', 'data points').

User's Resume Data Context:
${resumeData ? JSON.stringify(resumeData, null, 2) : "No resume data provided yet."}
`;

        const apiMessages = [
            { role: 'system', content: systemPrompt },
            ...messages
        ];

        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: apiMessages as any,
            temperature: 0.7,
            max_tokens: 600,
        });

        return NextResponse.json({
            role: 'assistant',
            content: response.choices[0].message.content,
        });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to process chat request' }, { status: 500 });
    }
}
