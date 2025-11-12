import { Groq } from 'groq-sdk';
import { executeWithKeyRotation, isRateLimitError } from './groqKeyRotation';

export type GenerateCompanySummaryInput = {
  companyName?: string;
  industry?: string;
  jobTitle?: string;
};

// Generate company summary using Grok API
export async function generateCompanySummary({ companyName, industry, jobTitle }: GenerateCompanySummaryInput): Promise<string> {

  const prompt = `You are an expert company description writer. Generate a brief, professional company summary.

${companyName ? `Company Name: ${companyName}` : ''}
${industry ? `Industry: ${industry}` : ''}
${jobTitle ? `Position: ${jobTitle}` : ''}

Generate a 2-3 sentence company summary that:
- Describes what the company does
- Highlights company values or culture
- Mentions the company's mission or vision
- Is professional and engaging

Keep it concise and professional.`;

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
          content: "You are an expert company description writer. Generate professional, concise company summaries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "openai/gpt-oss-120b",
      temperature: 1,
      max_completion_tokens: 300,
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
      console.error("Error generating company summary:", error);
      if (isRateLimitError(error)) {
        throw error; // Let key rotation handle it
      }
      throw new Error(error.message || "Failed to generate company summary");
    }
  });
}

