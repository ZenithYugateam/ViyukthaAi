import { Groq } from 'groq-sdk';
import { executeWithKeyRotation, isRateLimitError } from './groqKeyRotation';

export type GenerateJDInput = {
  role: string;
  skills: string;
  companySummary: string;
  jobDescription: string;
};

// Generate JD using Grok API
export async function generateJD({ role, skills, companySummary, jobDescription }: GenerateJDInput): Promise<string> {

  const prompt = `You are an expert job description writer. Based on the following information, generate a comprehensive, professional job description in clean, natural text format.

CRITICAL: The job description MUST be directly relevant to the Job Title/Role provided. All skills, responsibilities, and requirements should align with the specific role mentioned.

Job Title/Role: ${role}
${jobDescription ? `Initial Job Description/Requirements (USE THIS AS PRIMARY SOURCE):\n${jobDescription}` : ''}
${skills ? `Key Skills Required (ensure these align with the role): ${skills}` : ''}
${companySummary ? `Company Summary: ${companySummary}` : ''}

Generate a well-structured job description that includes:

1. Job Title & Overview
   - Job Title (clearly stated)
   - Location (with work arrangement: Remote/Hybrid/On-site)
   - Employment Type (Full-time/Part-time/Contract/Internship)
   - A compelling 2-3 sentence overview paragraph

2. Key Responsibilities
   Create a numbered list (1-10) of key responsibilities. Each should be:
   - Clear and action-oriented
   - Specific to the role
   - Use numbered format (1., 2., 3.)

3. Required Qualifications & Skills
   Organize into categories:
   - Education
   - Experience (years and type)
   - Core Technical Skills (use bullet points)
   - Testing & CI/CD (if applicable)
   - Containerization & Cloud (if applicable)
   - Agile Practices (if applicable)
   - Soft Skills

4. Preferred Qualifications
   List additional nice-to-have qualifications using bullet points

5. What We Offer / Benefits
   Create a bulleted list of benefits including:
   - Competitive Salary
   - Health & Wellness
   - Flexible Work arrangements
   - Professional Growth opportunities
   - Other relevant benefits

6. About Us
   A brief 2-3 sentence company description (if company summary provided)

IMPORTANT FORMATTING RULES:
- Write in clean, natural, professional text
- DO NOT use markdown formatting (no **, no ###, no ---, no | tables |)
- DO NOT use bold text markers or horizontal rules
- Use plain text with clear section headings (just text, not markdown)
- Use numbered lists (1., 2., 3.) for responsibilities
- Use bullet points (- or •) for lists
- Use line breaks and spacing for readability
- Make it look like a human wrote it, not AI-generated
- Keep it professional but natural and engaging
- Use proper capitalization and punctuation
- Write in a conversational yet professional tone

Generate the complete job description now in clean, natural text format:`;

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
          content: "You are an expert job description writer. Generate professional, comprehensive job descriptions."
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

    const generatedText = chatCompletion.choices[0]?.message?.content;

    if (!generatedText) {
      throw new Error("No content generated from Grok API");
    }

      return generatedText.trim();
    } catch (error: any) {
      console.error("Error generating JD:", error);
      if (isRateLimitError(error)) {
        throw error; // Let key rotation handle it
      }
      throw new Error(error.message || "Failed to generate job description");
    }
  });
}
