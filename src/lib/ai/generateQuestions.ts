import { Groq } from 'groq-sdk';
import { executeWithKeyRotation, isRateLimitError } from './groqKeyRotation';

export type GenerateQuestionsInput = {
  jd: string;
  numQuestions: number;
  interviewTypes?: string[];
  interviewMode?: "Technical" | "HR" | "General";
  categories?: string[];
  difficulty?: "Easy" | "Medium" | "Hard" | "Mixed";
};

export type GeneratedQuestion = {
  text: string;
  type: "Text" | "MCQ" | "Code" | "Voice";
  weight: number;
  evalMode: "Auto" | "Manual";
  difficulty?: "Easy" | "Medium" | "Hard" | "Mixed";
  expectedAnswer?: string;
  options?: string[];
};

// Generate questions using Grok API
export async function generateQuestions({ jd, numQuestions, interviewTypes = [], interviewMode = "General", categories = [], difficulty = "Mixed" }: GenerateQuestionsInput): Promise<GeneratedQuestion[]> {

  const interviewTypeContext = interviewTypes.length > 0 
    ? `Interview Types: ${interviewTypes.join(", ")}. Generate questions appropriate for these interview types.`
    : "";

  const interviewModeContext = interviewMode !== "General"
    ? `Interview Mode: ${interviewMode}. ${interviewMode === "Technical" ? "Focus on domain-specific technical skills, practical knowledge, problem-solving, and expertise relevant to the field (could be medical procedures, legal knowledge, engineering principles, IT skills, or any domain-specific expertise)." : "Focus on behavioral questions, soft skills, cultural fit, communication, teamwork, leadership, and HR-related topics applicable to any industry."}`
    : "";

  const categoryContext = categories.length > 0
    ? `Focus on these specific areas: ${categories.join(", ")}.`
    : "";

  const difficultyContext = difficulty !== "Mixed"
    ? `Difficulty Level: ${difficulty}. ${difficulty === "Easy" ? "Generate questions suitable for entry-level or junior candidates - basic concepts, fundamental knowledge." : difficulty === "Medium" ? "Generate questions suitable for mid-level candidates - moderate complexity, practical application." : "Generate questions suitable for senior or expert-level candidates - advanced concepts, complex problem-solving."}`
    : `Difficulty Level: Mixed. Generate a mix of Easy, Medium, and Hard questions appropriate for different candidate levels.`;

  const prompt = `You are an expert interview question generator for ALL industries and domains - including but not limited to: Medical, Law, Engineering, IT, Finance, Education, Healthcare, Sales, Marketing, Operations, HR, Non-profit, Government, and any other field. Based on the following job description, generate ${numQuestions} high-quality interview questions that are relevant to the specific domain and role.

${interviewTypeContext}
${interviewModeContext}
${categoryContext}
${difficultyContext}

Job Description:
---
${jd}
---

IMPORTANT: This platform is used across ALL industries and domains. Analyze the job description to identify:
- The industry/domain (Medical, Legal, IT, Engineering, Finance, Education, Healthcare, etc.)
- The specific role and responsibilities
- Required domain-specific knowledge and skills
- Industry-specific terminology and practices

Generate ${numQuestions} diverse interview questions that:
1. Are highly relevant to the specific domain and role described
2. Test domain-specific knowledge, skills, and expertise
3. Include practical scenarios relevant to the industry
4. Match the interview mode specified (${interviewMode})
5. Cover the focus areas specified (if provided)
6. Are appropriate for the industry context (e.g., medical ethics for healthcare, legal precedents for law, coding for IT, clinical procedures for medical, etc.)

For each question, provide:
- The question text (tailored to the domain and difficulty level)
- Question type: "Text", "MCQ", "Code", or "Voice"
  * Use "Code" for IT/Software roles (programming challenges)
  * Use "Code" for other domains only if practical problem-solving exercises are relevant
  * Use "Text" for most domain-specific knowledge questions
  * Use "MCQ" for factual knowledge, definitions, or multiple-choice scenarios
  * Use "Voice" for conversational, behavioral, or situational questions
- Difficulty level: "${difficulty}" (or distribute across Easy/Medium/Hard if Mixed)
- Expected answer: Provide a brief expected answer or key points that should be covered (2-3 sentences)
- If MCQ type, provide 4 realistic options relevant to the domain
- Appropriate weight (percentage, should total around 100% for all questions)
- Evaluation mode: "Auto" or "Manual" (use "Manual" for Voice and complex domain-specific questions)

Return your response as a JSON array with this exact format:
[
  {
    "text": "Question text here (domain-specific)",
    "type": "Text",
    "weight": 20,
    "evalMode": "Auto",
    "difficulty": "${difficulty === "Mixed" ? "Easy|Medium|Hard" : difficulty}",
    "expectedAnswer": "Brief expected answer or key points (2-3 sentences)",
    "options": [] // only for MCQ type
  },
  ...
]

Question Type Guidelines:
- Text: Open-ended questions about domain knowledge, experience, problem-solving approaches
- MCQ: Multiple choice questions testing factual knowledge, definitions, or scenario-based choices
- Code: Practical problem-solving exercises (primarily for IT/Software roles, but can be adapted for other technical fields)
- Voice: Conversational questions about behavior, situations, communication, and soft skills

${interviewMode === "Technical" ? "Focus on domain-specific technical depth, practical knowledge, problem-solving methodologies, and expertise relevant to the field. For IT roles: coding problems, system design. For Medical: clinical procedures, diagnosis, treatment protocols. For Law: legal precedents, case analysis, regulations. For Engineering: design principles, calculations, standards. Adapt to the specific domain." : interviewMode === "HR" ? "Focus on behavioral questions, situational scenarios, teamwork, leadership, cultural fit, communication skills, conflict resolution, and professional ethics - applicable to any industry." : "Include a balanced mix of domain-specific knowledge questions, practical scenarios, behavioral questions, and problem-solving relevant to the field."}`;

  return executeWithKeyRotation(async (apiKey: string) => {
    const groq = new Groq({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    try {
      const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert interview question generator. Always return valid JSON arrays only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      stream: false,
      reasoning_effort: "medium",
    });

    const content = chatCompletion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content generated from Grok API");
    }

    // Parse JSON response
    let parsed: GeneratedQuestion[];
    try {
      const jsonData = JSON.parse(content);
      // Handle both direct array and object with questions property
      parsed = Array.isArray(jsonData) ? jsonData : (jsonData.questions || []);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*(\[[\s\S]*\])\s*```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse JSON response from Grok API");
      }
    }

    // Validate and normalize questions
    const questions: GeneratedQuestion[] = parsed.map((q: any, index: number) => {
      const question: GeneratedQuestion = {
        text: q.text || `Question ${index + 1}`,
        type: ["Text", "MCQ", "Code", "Voice"].includes(q.type) ? q.type : "Text",
        weight: Math.max(1, Math.min(100, Number(q.weight) || Math.floor(100 / numQuestions))),
        evalMode: q.type === "Voice" ? "Manual" : (q.evalMode === "Manual" ? "Manual" : "Auto"),
        difficulty: ["Easy", "Medium", "Hard", "Mixed"].includes(q.difficulty) ? q.difficulty : difficulty,
        expectedAnswer: q.expectedAnswer || "",
      };

      if (question.type === "MCQ" && Array.isArray(q.options) && q.options.length > 0) {
        question.options = q.options.slice(0, 4);
      } else if (question.type === "MCQ") {
        question.options = ["Option A", "Option B", "Option C", "Option D"];
      }

      return question;
    });

    // Ensure we have the requested number of questions
    if (questions.length < numQuestions) {
      // If we got fewer questions, duplicate and modify the last one
      while (questions.length < numQuestions) {
        const lastQ = questions[questions.length - 1];
        questions.push({
          ...lastQ,
          text: `${lastQ.text} (Variation ${questions.length + 1})`,
        });
      }
    }

      // Limit to requested number
      return questions.slice(0, numQuestions);
    } catch (error: any) {
      console.error("Error generating questions:", error);
      if (isRateLimitError(error)) {
        throw error; // Let key rotation handle it
      }
      throw new Error(error.message || "Failed to generate interview questions");
    }
  });
}
