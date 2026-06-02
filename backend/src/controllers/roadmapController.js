import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateRoadmap = async (req, res) => {
  try {
    const { role, level } = req.body;

    if (!role || !level) {
      return res.status(400).json({ success: false, message: "Missing required fields role or level" });
    }

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

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const response = completion.choices[0].message.content;
    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsedRoadmap = JSON.parse(cleaned);

    res.json({
      success: true,
      data: parsedRoadmap,
    });
  } catch (error) {
    console.error("Roadmap controller error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
