import { aiService } from "./aiService";

export const cheatsheetService = {
  generate: async (topic, difficulty) => {
    try {
      const prompt = `
Generate PROFESSIONAL study notes for:

Topic:
${topic}

Difficulty:
${difficulty}

IMPORTANT REQUIREMENTS:

The notes should feel like:
- ChatGPT explanation
- Developer documentation
- College study material
- Interview preparation notes

STRUCTURE RULES:

# Start with Beginner recap
Even if difficulty is Advanced.

# Then move gradually:
Beginner → Intermediate → Advanced

# Include:
- Clear explanations
- Real examples
- Code snippets
- Comparisons
- Architecture explanation
- Real-world use cases
- Interview concepts
- Summary notes

# FORMAT RULES:
- Use proper markdown
- Use headings (# ## ###)
- Use bullet points
- Use code blocks
- Use tables when useful
- Make it highly readable
- Make it educational
- Make it revision-friendly

# VERY IMPORTANT:
Do NOT generate tiny one-line answers.
Explain concepts properly.

# OUTPUT STYLE:
Should look like:
- Developer article
- AI-generated study notes
- Technical tutorial
- Learning material

Return ONLY markdown.
`;

      const response = await aiService.callGroq(
        [
          {
            role: "system",
            content: "You are an expert technical educator and interview mentor.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        "llama-3.3-70b-versatile",
        0.5
      );

      return {
        title: `${topic} Notes`,
        content: response,
      };
    } catch (error) {
      console.error("Cheat Sheet API synthesis failed:", error);
      throw error;
    }
  },
};