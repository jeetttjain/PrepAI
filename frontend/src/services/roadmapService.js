import { aiService } from "./aiService";

export const roadmapService = {
  generate: async (role, level) => {
    try {
      const prompt = `
You are an expert career consultant, technical educator, and career advisor.
Generate a structured, professional engineering learning roadmap for a candidate targetting the role of: "${role}" at experience level: "${level}".
You must respond with ONLY a valid, parseable JSON object matching the following structure:
{
  "salary": "$160k",
  "growth": "+25%",
  "scarcity": "High",
  "timeToRole": "~6mo",
  "stages": [
    {
      "number": "Stage 01",
      "title": "Deep Tech Foundation",
      "description": "Mastering the foundational principles of modern cloud and architecture patterns.",
      "skills": ["Kubernetes Networking", "Docker Systems", "Go Contexts"],
      "project": "Build and scale a containerized backend processing high volume calls.",
      "targets": ["Dockerizing complex applications", "Configuring reverse proxy layers"],
      "status": "Current Focus"
    }
  ]
}

Requirements:
- Provide exactly 3 learning stages mapped progressively (Beginner/Intermediate -> Intermediate -> Advanced).
- First stage "status" MUST be "Current Focus", second MUST be "Next Milestone", third MUST be "Advanced".
- Ensure ALL properties exist and match the schema.
- Respond with ONLY the raw valid JSON, no markdown formatting blocks.
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

      const apiData = JSON.parse(cleaned);
      
      return {
        id: 'rm_' + Date.now(),
        role,
        level,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        salary: apiData.salary || '$130k',
        growth: apiData.growth || '+15%',
        scarcity: apiData.scarcity || 'High',
        timeToRole: apiData.timeToRole || '~6mo',
        stages: apiData.stages.map((s, idx) => ({
          ...s,
          id: `rm_stage_${idx}_` + Date.now()
        }))
      };
    } catch (err) {
      console.error("Roadmap API synthesis failed:", err);
      throw err;
    }
  }
};
