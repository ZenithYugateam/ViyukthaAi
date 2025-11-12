import { Groq } from 'groq-sdk';
import type { Question } from '@/data/mock-company-dashboard';
import { executeWithKeyRotation, isRateLimitError } from './groqKeyRotation';

export type InterviewMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type InterviewContext = {
  jobTitle?: string;
  jobDescription?: string;
  questions?: Question[];
  currentQuestionIndex?: number;
  interviewRound?: "General" | "Technical" | "HR";
};

// Conduct interview using Groq API
export async function conductInterview(
  messages: InterviewMessage[],
  context?: InterviewContext
): Promise<ReadableStream<Uint8Array>> {

  // Build system prompt based on context
  let systemPrompt = "You are a professional AI interviewer conducting a job interview. Be conversational, ask follow-up questions, and provide natural feedback.";
  
  if (context?.jobTitle) {
    systemPrompt += `\n\nJob Position: ${context.jobTitle}`;
  }
  
  if (context?.jobDescription) {
    systemPrompt += `\n\nJob Description:\n${context.jobDescription}`;
  }
  
  if (context?.questions && context.currentQuestionIndex !== undefined && context.currentQuestionIndex >= 0) {
    const currentQuestion = context.questions[context.currentQuestionIndex];
    if (currentQuestion) {
      systemPrompt += `\n\nCurrent Question (${context.interviewRound || 'General'} Round): ${currentQuestion.text}`;
      if (currentQuestion.expectedAnswer) {
        systemPrompt += `\n\nExpected Answer Key Points: ${currentQuestion.expectedAnswer}`;
      }
      systemPrompt += `\n\nAsk this question naturally and engage with the candidate's response.`;
    }
  }
  
  if (context?.interviewRound) {
    const roundContext = {
      "General": "Focus on general knowledge, communication skills, and overall fit for the role.",
      "Technical": "Focus on technical skills, problem-solving, domain-specific knowledge, and practical expertise.",
      "HR": "Focus on behavioral questions, soft skills, cultural fit, teamwork, and professional experience."
    };
    systemPrompt += `\n\nInterview Round: ${context.interviewRound}. ${roundContext[context.interviewRound]}`;
  }

  systemPrompt += "\n\nCRITICAL: Keep responses VERY SHORT and concise. Maximum 1-2 sentences. Do NOT give lengthy explanations. Be direct and to the point. Ask the question and move on.";
  systemPrompt += "\n\nIMPORTANT: Do NOT use markdown formatting like **question** or **next question**. Speak naturally without any markdown, asterisks, or special formatting. Just use plain text.";

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
            content: systemPrompt
          },
          ...messages,
        ],
        model: "openai/gpt-oss-120b",
        temperature: 0.8,
        max_completion_tokens: 8192,
        top_p: 1,
        stream: true,
        reasoning_effort: "medium",
      });

      // Convert async iterator to ReadableStream
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of chatCompletion) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return stream;
    } catch (error: any) {
      console.error("Error conducting interview:", error);
      if (isRateLimitError(error)) {
        throw error; // Let key rotation handle it
      }
      throw new Error(error.message || "Failed to conduct interview");
    }
  });
}

// Evaluate answer accuracy and generate corrected answer using Groq API
export async function evaluateAnswer(
  question: string,
  expectedAnswer: string,
  candidateAnswer: string
): Promise<{ accuracy: number; correctedAnswer: string; answerAnalysis: string }> {
  const prompt = `You are an expert interviewer evaluating a candidate's answer. Analyze how well the candidate's answer addresses the question asked and provide a corrected/expected answer.

Question: ${question}

Expected Answer/Key Points: ${expectedAnswer}

Candidate's Answer: ${candidateAnswer}

CRITICAL EVALUATION CRITERIA:

1. RELEVANCE CHECK (Most Important - 0-40 points):
   - Does the answer directly address what was asked?
   - Are the keywords/concepts from the question mentioned or addressed?
   - Example: If asked about "Spring Boot REST controller" and answer mentions "Spring Boot" or "REST" or "controller" or "API", give some relevance points (20-30)
   - Example: If asked about "Spring Boot REST controller" and answer only says "inheritance concept", give very low relevance (5-15)
   - Example: If asked about "microservices" and answer mentions "SQL injection", give very low relevance (0-10)

2. TECHNICAL ACCURACY (0-30 points):
   - If answer is relevant, is it technically correct?
   - If answer mentions correct concepts but in wrong context, give partial points

3. COMPLETENESS (0-20 points):
   - Does it cover the main points asked?
   - Is it a complete answer or just a fragment?

4. CLARITY (0-10 points):
   - Is the answer clear and understandable?

SCORING EXAMPLES:
- Answer "using inheritance concept" to question about Spring Boot REST controller: 5-15% (completely off-topic)
- Answer "Spring Boot and Maven" to question about Spring annotations: 15-25% (mentions Spring but doesn't answer annotation question)
- Answer "SQL injection" to question about microservices design: 0-10% (completely unrelated)
- Answer that mentions REST, controller, Spring Boot but incomplete: 40-60% (relevant but incomplete)
- Answer that correctly addresses the question: 70-100% (depending on completeness and accuracy)

IMPORTANT: Also provide a corrected/expected answer that:
- If the candidate's answer is correct or mostly correct, acknowledge it and provide a more complete version
- If the candidate's answer is wrong or off-topic, provide the correct answer based on the question and expected answer key points
- Make it clear, concise, and educational
- Format it as a natural, professional response (2-4 sentences)

Also provide a brief analysis (1-2 sentences) explaining how the candidate answered the question - what they got right, what they missed, or why their answer was off-topic.

Return your response as a JSON object with this exact format:
{
  "accuracy": <number between 0-100>,
  "correctedAnswer": "<the corrected/expected answer text>",
  "answerAnalysis": "<brief analysis of how candidate answered - what was good, what was missing, why low score>"
}

Return ONLY valid JSON, nothing else.`;

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
            content: "You are an expert interviewer evaluating candidate answers. Return only valid JSON with accuracy (0-100) and correctedAnswer (string) fields."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "openai/gpt-oss-120b",
        temperature: 0.3,
        max_completion_tokens: 500,
        top_p: 1,
        stream: false,
      });

      const content = chatCompletion.choices[0]?.message?.content?.trim();
      
      // Try to parse JSON response
      try {
        // Extract JSON from markdown code blocks if present
        const jsonMatch = content?.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || [null, content];
        const jsonStr = jsonMatch[1] || content || '{}';
        const parsed = JSON.parse(jsonStr);
        
        const accuracy = Math.max(0, Math.min(100, parseInt(parsed.accuracy) || 0));
        const correctedAnswer = parsed.correctedAnswer || expectedAnswer || "No corrected answer available.";
        const answerAnalysis = parsed.answerAnalysis || "Analysis not available.";
        
        return {
          accuracy: isNaN(accuracy) ? 0 : accuracy,
          correctedAnswer: correctedAnswer.trim(),
          answerAnalysis: answerAnalysis.trim()
        };
      } catch (parseError) {
        console.error("Error parsing evaluation response:", parseError);
        // Fallback: extract number from response
        const numberMatch = content?.match(/\d+/);
        const accuracy = numberMatch ? Math.max(0, Math.min(100, parseInt(numberMatch[0]))) : 0;
        
        return {
          accuracy: isNaN(accuracy) ? 0 : accuracy,
          correctedAnswer: expectedAnswer || "No corrected answer available.",
          answerAnalysis: "Unable to analyze answer."
        };
      }
    } catch (error: any) {
      console.error("Error evaluating answer:", error);
      if (isRateLimitError(error)) {
        throw error; // Let key rotation handle it
      }
      // Return default values if evaluation fails
      return {
        accuracy: 0,
        correctedAnswer: expectedAnswer || "No corrected answer available.",
        answerAnalysis: "Evaluation failed."
      };
    }
  });
}

