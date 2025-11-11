export type GenerateJDInput = {
  role: string;
  skills: string;
  companySummary: string;
  tone: string;
  difficulty: string;
};

// Abstract function the agent can later swap for real OpenAI/Groq calls
export async function generateJD({ role, skills, companySummary, tone, difficulty }: GenerateJDInput): Promise<string> {
  // Mocked implementation
  await new Promise((r) => setTimeout(r, 600));
  const intro = `We are seeking a ${role} to join our team. In this role, you will collaborate across functions to deliver high-quality outcomes. Our environment values ownership, fast iteration, and craftsmanship.`;
  const body = `You should be comfortable working with ${skills || "relevant technologies"}. You will contribute to planning, implementation, and continuous improvement while maintaining a ${tone.toLowerCase()} and ${difficulty.toLowerCase()} level of rigor in problem-solving.`;
  const about = companySummary
    ? `About us: ${companySummary}`
    : `About us: We are a growth-stage company focused on building delightful, reliable products with meaningful impact.`;
  return [intro, body, about].join("\n\n");
}
