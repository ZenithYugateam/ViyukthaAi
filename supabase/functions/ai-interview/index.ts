import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, category = "general", action = "chat" } = await req.json();
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY is not configured");

    // Handle performance analysis
    if (action === "analyze") {
      const analysisPrompt = `You are an expert interview evaluator. Analyze this interview conversation and provide a comprehensive performance report.

Conversation:
${JSON.stringify(messages)}

Provide your analysis in the following JSON format:
{
  "overall_score": <0-100>,
  "technical_knowledge": <0-100>,
  "communication_skills": <0-100>,
  "confidence_level": <0-100>,
  "problem_solving": <0-100>,
  "ai_summary": "<detailed natural summary of performance>",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"]
}

Be specific and constructive in your feedback.`;

      const analysisResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: analysisPrompt }],
          temperature: 0.7,
        }),
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error("AI analysis error:", analysisResponse.status, errorText);
        if (analysisResponse.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (analysisResponse.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ error: "Failed to generate performance analysis" }), {
          status: analysisResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const analysisData = await analysisResponse.json();
      const content = analysisData.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle chat
    const categoryPrompts: Record<string, string> = {
      general: "You are an experienced HR interviewer conducting a professional job interview. Start by greeting the candidate warmly and explaining the interview structure. Ask insightful questions about their background, strengths, career goals, and experiences. Provide brief, encouraging feedback after each answer. Be conversational and engaging. Keep responses under 3 sentences.",
      java: "You are a senior Java developer conducting a technical interview. Greet the candidate and explain you'll be asking about Java concepts, design patterns, and problem-solving. Give brief feedback and ask technical questions naturally. Keep responses concise (2-3 sentences max).",
      python: "You are a senior Python developer conducting a technical interview. Welcome the candidate and let them know you'll discuss Python concepts, data structures, frameworks, and best practices. Adapt questions to their expertise level. Keep it conversational and concise (2-3 sentences).",
      javascript: "You are a senior JavaScript developer conducting a technical interview. Greet the candidate and explain you'll cover JS fundamentals, ES6+, async programming, and web development. Give brief feedback and be engaging. Keep responses short (2-3 sentences).",
      sql: "You are a database expert conducting a technical interview. Welcome the candidate and explain you'll discuss SQL queries, database design, optimization, and data modeling. Provide scenarios when relevant. Keep it concise (2-3 sentences).",
      react: "You are a senior React developer conducting a technical interview. Greet the candidate warmly and let them know you'll explore React concepts, hooks, state management, and performance. Build on responses naturally. Keep it short (2-3 sentences).",
      fullstack: "You are a senior full-stack developer conducting a technical interview. Welcome the candidate and explain you'll cover frontend, backend, architecture, scalability, and security. Give quick feedback naturally. Keep responses concise (2-3 sentences).",
    };

    const systemPrompt = categoryPrompts[category] || categoryPrompts.general;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: systemPrompt
          },
          ...messages,
        ],
        stream: true,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("AI Gateway error:", response.status, error);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Interview error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
