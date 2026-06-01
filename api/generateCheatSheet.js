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
    const { topic, difficulty } = req.body;

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

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in Vercel environment variables.");
    }

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert technical educator and interview mentor.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
    });

    const response = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      data: {
        title: `${topic} Notes`,
        content: response,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
