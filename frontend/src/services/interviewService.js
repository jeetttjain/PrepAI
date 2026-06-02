import { aiService } from "./aiService";

export const interviewService = {
  generate: async (
    role,
    level,
    type,
    count,
    language = "English",
    exclude = []
  ) => {
    try {
      const targetLang = language || "English";
      const parsedCount = Math.min(Math.max(parseInt(count) || 5, 1), 25);
      const requestCount = Math.min(parsedCount + 20, 45);

      const excludeList = Array.isArray(exclude) ? exclude.filter(Boolean) : [];
      const excludedSet = new Set(
        excludeList.map((q) => q.toLowerCase().replace(/[^a-z0-9]/g, ""))
      );

      let excludeSection = "";
      if (excludeList.length > 0) {
        excludeSection = `
CRITICAL: DO NOT generate any of the following questions or topics similar to them (they are already generated in the active session):
${excludeList.map((q) => `- "${q}"`).join("\n")}
Ensure all generated questions are COMPLETELY new, different, and do not repeat any themes or concepts from the list above.
`;
      }

      const prompt = `
Generate EXACTLY ${requestCount} realistic, professional interview questions.
${excludeSection}

Return ONLY valid JSON array.

Format:
[
  {
    "question": "...",
    "answer": "...",
    "difficulty": "Easy"
  }
]

Role:
${role}

Experience Level:
${level}

Tech Stack:
${type || "Generic"}

Interview Type:
${type}

Language:
${targetLang}

Requirements:
- BOTH questions and answers MUST be written in ${targetLang} language.
- Questions must match role, experience level, and tech stack.
- EACH question MUST cover a completely different technical concept, API, system paradigm, or programming paradigm.
- STRICTLY DO NOT repeat the same topic, theme, API, or question structure. Ensure high diversity across the tech stack skills.
- Answers should be professional and concise.
- No markdown, no extra text, just the raw JSON array.
- Answers should include a short direct explanation, detailed explanation, and real-world example if possible.
`;

      const response = await aiService.callGroq(
        [
          { role: "user", content: prompt }
        ],
        "llama-3.3-70b-versatile",
        0.7
      );

      const cleaned = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);
      const seen = new Set();
      const uniqueQuestions = [];

      for (const item of parsed) {
        if (!item || !item.question) continue;
        const normalized = item.question.toLowerCase().replace(/[^a-z0-9]/g, "");

        if (!seen.has(normalized) && !excludedSet.has(normalized)) {
          seen.add(normalized);
          uniqueQuestions.push(item);
        }
      }

      const finalQuestions = uniqueQuestions.slice(0, parsedCount);

      const questions = finalQuestions.map((item, index) => ({
        id: crypto.randomUUID(),
        number: `Q${index + 1}`,
        difficulty: item.difficulty || "Medium",
        question: item.question,
        answer: item.answer,
        context: `${type} Interview Question`,
      }));

      return {
        id: crypto.randomUUID(),
        role,
        level,
        questions,
        language,
      };
    } catch (error) {
      console.error("Interview API synthesis failed:", error);
      throw error;
    }
  },
};