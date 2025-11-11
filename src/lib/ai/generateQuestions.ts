export type GenerateQuestionsInput = {
  jd: string;
  numQuestions: number;
  difficulty: string;
  categories?: string[];
};

export type GeneratedQuestion = {
  text: string;
  type: "Text" | "MCQ" | "Code" | "Voice";
  weight: number;
  evalMode: "Auto" | "Manual";
  options?: string[];
};

// Mocked, deterministic-ish generator. Swap with real LLM later.
export async function generateQuestions({ jd, numQuestions, difficulty, categories = [] }: GenerateQuestionsInput): Promise<GeneratedQuestion[]> {
  await new Promise((r) => setTimeout(r, 700));
  const base = jd?.slice(0, 80).replace(/\s+/g, " ") || "the role";
  const difLabel = difficulty || "Medium";
  const cats = categories.length ? ` in ${categories.join(", ")}` : "";
  const types: GeneratedQuestion["type"][] = ["Text", "MCQ", "Code", "Voice"];
  const out: GeneratedQuestion[] = [];
  for (let i = 0; i < Math.max(1, numQuestions || 5); i++) {
    const t = types[i % types.length];
    const q: GeneratedQuestion = {
      text: `(${difLabel}) Q${i + 1}${cats ? ` [${cats}]` : ""}: Based on ${base}, discuss aspect #${i + 1}.`,
      type: t,
      weight: 10,
      evalMode: t === "Voice" ? "Manual" : "Auto",
    };
    if (t === "MCQ") {
      q.options = ["Option A", "Option B", "Option C", "Option D"];
    }
    out.push(q);
  }
  return out;
}
