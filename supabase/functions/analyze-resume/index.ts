import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobFunction, jobType } = await req.json();
    
    // Truncate resume text to avoid context length issues
    const truncatedResume = resumeText.slice(0, 3000);
    
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    console.log("Analyzing resume for job function:", jobFunction);

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer and career coach. 
Your task is to analyze resumes and provide actionable insights for job seekers.`;

    const userPrompt = `Analyze this resume for a ${jobFunction} ${jobType} position:

Resume Content (first 3000 chars):
${truncatedResume}

Provide a structured analysis with:
1. Match Score (0-10): How well does this resume match the typical requirements for ${jobFunction}?
2. Job Title Match: Does the candidate's experience align with ${jobFunction}? (Good Match / Needs Improvement / Poor Match)
3. Keyword Match: Count how many relevant keywords for ${jobFunction} are present in the resume (e.g., "4/15 keywords found")
4. Missing Keywords: List 5-10 specific technical skills, tools, or keywords that are commonly required for ${jobFunction} but are missing from this resume
5. Missing Sections: Identify any resume sections that should be enhanced (Summary, Skills, Experience, Education, Projects, Certifications)
6. Resume Structure: Identify the sections present in the resume and their order (e.g., ["Contact", "Summary", "Experience", "Education", "Skills", "Projects"])

Format your response as JSON with this exact structure:
{
  "matchScore": 3.5,
  "jobTitleMatch": "Needs Improvement",
  "keywordCount": 4,
  "totalExpectedKeywords": 15,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "sectionsToEnhance": ["Summary", "Skills", ...],
  "resumeStructure": ["Contact", "Summary", "Experience", "Education", "Skills"]
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0,
        max_tokens: 2048,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const analysisResult = JSON.parse(data.choices[0]?.message?.content || "{}");
    
    console.log("Analysis complete:", analysisResult);

    return new Response(
      JSON.stringify(analysisResult),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
