import { Groq } from 'groq-sdk';
import { executeWithKeyRotation, isRateLimitError } from './groqKeyRotation';

export type GenerateSkillsInput = {
  jobTitle: string;
  jobDescription?: string;
  experience?: string;
};

// Generate skills using Grok API
export async function generateSkills({ jobTitle, jobDescription, experience }: GenerateSkillsInput): Promise<string> {

  const prompt = `You are an expert recruiter and job analyst. Based on the following job information, generate a list of key skills required for this position.

CRITICAL: The skills MUST be directly relevant to the Job Title and Job Description provided. Extract skills that are specifically mentioned or implied in the job description. Do NOT add generic or unrelated skills.

Job Title: ${jobTitle}
${jobDescription ? `Job Description (PRIMARY SOURCE - extract skills from here):\n${jobDescription}` : ''}
${experience ? `Experience Required: ${experience}` : ''}

Generate a comma-separated list of 8-15 key skills that are:
1. Directly mentioned in the job description
2. Essential for the specific role mentioned
3. Relevant to the job title and responsibilities

Include:
- Technical skills (programming languages, frameworks, tools) - ONLY if mentioned or relevant to the role
- Soft skills (communication, leadership, etc.) - ONLY if mentioned or relevant
- Domain-specific skills - ONLY if mentioned or relevant
- Certifications or qualifications - ONLY if mentioned

Return ONLY a comma-separated list of skills, nothing else. Example format: React, Node.js, Python, AWS, Docker, Agile, Communication, Leadership`;

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
          content: "You are an expert recruiter. Generate concise, relevant skills lists for job positions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 1,
      max_completion_tokens: 500,
      top_p: 1,
      stream: false,
      reasoning_effort: "medium",
    });

    const generatedText = chatCompletion.choices[0]?.message?.content;

    if (!generatedText) {
      throw new Error("No content generated from Grok API");
    }

      return generatedText.trim();
    } catch (error: any) {
      console.error("Error generating skills:", error);
      if (isRateLimitError(error)) {
        throw error; // Let key rotation handle it
      }
      throw new Error(error.message || "Failed to generate skills");
    }
  });
}

