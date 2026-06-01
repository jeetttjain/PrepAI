import Groq from "groq-sdk";

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { role, level } = req.body;

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in Vercel environment variables.");
    }

    const groq = new Groq({ apiKey });
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

    res.status(200).json({
      success: true,
      data: parsedRoadmap,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
