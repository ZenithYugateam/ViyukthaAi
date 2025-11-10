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
    const body = await req.json();
    console.log("Received request body:", body);
    
    const { 
      resumeText, 
      desiredJobRole,
      keywords,
      sectionsToEnhance, 
      missingKeywords,
      jobFunction,
      jobRole,
      resumeStructure 
    } = body;
    
    // Support both old and new parameter formats
    const finalJobRole = desiredJobRole || jobRole || "Professional";
    const finalKeywords = keywords || missingKeywords || "";
    
    if (!resumeText) {
      throw new Error("resumeText is required");
    }
    
    // Truncate resume text to avoid context length issues
    const truncatedResume = resumeText.slice(0, 4000);
    
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
    
    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    console.log("Job Role:", finalJobRole);
    console.log("Keywords:", finalKeywords);
    console.log("Generating enhanced resume...");

    const systemPrompt = `You are an expert resume writer and ATS optimization specialist. Your task is to enhance resumes to be ATS-friendly while maintaining professional quality and truthfulness. You MUST return valid JSON only.`;

    const userPrompt = `Enhance this resume for the role: ${finalJobRole}
${sectionsToEnhance?.length ? `Focus on improving these sections: ${sectionsToEnhance.join(", ")}` : "Improve all sections"}
${finalKeywords ? `Naturally incorporate these keywords: ${finalKeywords}` : ""}

Original Resume:
${truncatedResume}

CRITICAL INSTRUCTIONS:
1. Extract ALL information from the original resume
2. Maintain ALL original achievements, projects, and experiences
3. Improve wording to be more impactful and ATS-friendly
4. Add the selected keywords naturally where relevant
5. Keep all dates, institutions, and factual information accurate
6. Format projects with clear titles, descriptions, and technologies used

Return ONLY valid JSON (no markdown, no extra text) in this EXACT structure:
{
  "personalInfo": {
    "name": "Full Name from resume",
    "email": "email@example.com",
    "phone": "phone number",
    "location": "City, State/Country",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "portfolio": "portfolio URL if present"
  },
  "summary": "Enhanced professional summary (2-3 sentences highlighting key strengths and experience)",
  "education": [
    {
      "institution": "University Name",
      "degree": "B.Tech in Computer Science Engineering (AI/ML)",
      "location": "City",
      "startDate": "2021",
      "endDate": "2025",
      "gpa": "8.5/10 if mentioned",
      "highlights": ["Achievement 1", "Achievement 2"]
    }
  ],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, State",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "highlights": [
        "Achievement with metrics (e.g., Improved X by 40%)",
        "Key responsibility with impact",
        "Technical contribution"
      ]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief 1-2 sentence description of the project",
      "technologies": ["Tech1", "Tech2", "Tech3", "Tech4"],
      "highlights": [
        "Key achievement or feature",
        "Impact or result",
        "Technical implementation detail"
      ],
      "date": "Month Year",
      "link": "project URL if available"
    }
  ],
  "skills": {
    "languages": ["Python", "JavaScript", "Java"],
    "technologies": ["React", "Node.js", "TensorFlow", "Docker", "AWS"],
    "tools": ["Git", "VS Code", "Figma"]
  }
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
        temperature: 0.7,
        max_tokens: 3000,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Resume generation failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const enhancedResumeData = JSON.parse(data.choices[0]?.message?.content || "{}");
    
    console.log("Resume generation complete");

    return new Response(
      JSON.stringify({ generatedResume: enhancedResumeData }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("generate-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
