import { clientParser } from "./clientParser";
import { aiService } from "./aiService";

export const resumeService = {
  analyze: async (file, role, languages = []) => {
    try {
      const extractedText = await clientParser.parse(file);
      if (!extractedText || extractedText.length < 20) {
        throw new Error("The uploaded resume contains insufficient readable text.");
      }

      const prompt = `
You are an expert applicant tracking system (ATS) scanner and recruitment consultant.
Analyze the following resume details for the target job role of: "${role}".
Also verify if the candidate declares fluency/skills in the following languages: ${languages.join(", ")}.

Resume text content:
"""
${extractedText.slice(0, 15000)}
"""

Based on the resume content and target job role, perform a professional evaluation. You must respond with ONLY a valid, parseable JSON object matching the following structure:
{
  "atsScore": 87,
  "targetRole": "${role}",
  "identifiedSkills": ["React", "Node.js", "Express", "MongoDB", "JavaScript"],
  "missingSkills": ["TypeScript", "Docker", "AWS"],
  "summary": "Professional concise assessment summary of how well the candidate matches the target role, highlighting strengths and missing requirements.",
  "tips": [
    {
      "title": "Highlight your TypeScript application",
      "detail": "We suggest drafting a concise bullet point in your experience section explaining how you implemented TypeScript to improve type safety."
    }
  ],
  "foundLanguages": ["English"],
  "missingLanguages": ["German"],
  "configuredLanguages": ["English", "German"]
}

Requirements:
- "atsScore" should be a realistic score (0 to 100) assessing compatibility. Be realistic but encouraging.
- "identifiedSkills" must be a list of actual technical/professional skills found in the resume text that are highly relevant to a "${role}".
- "missingSkills" must be a list of common skills for a "${role}" that were NOT found or are weak in the resume.
- "tips" must contain exactly 3-4 actionable, high-quality advice items for improving the resume's match for "${role}".
- "foundLanguages" must consist only of languages from the list of requested languages (${languages.join(", ")}) that are mentioned or likely declared in the resume.
- "missingLanguages" must consist of requested languages that are missing.
- "configuredLanguages" must be the exact list requested: [${languages.map((l) => `"${l}"`).join(", ")}].
- Ensure ONLY valid JSON is returned, without markdown wrappers or extra text.
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

      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Resume ATS evaluation failed:", err);
      throw err;
    }
  },
};
