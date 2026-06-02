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
    const {
      role,
      experience,
      techstack,
      difficulty,
      count,
      language,
      exclude,
    } = req.body;

    const targetLang = language || "English";
    // Strictly cap count at 25
    const parsedCount = Math.min(Math.max(parseInt(count) || 5, 1), 25);

    const excludeList = Array.isArray(exclude) ? exclude.filter(Boolean) : [];
    const seen = new Set();
    const uniqueQuestions = [];

    // Pre-populate seen set with already excluded questions
    for (const q of excludeList) {
      seen.add(q.toLowerCase().replace(/[^a-z0-9]/g, ""));
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined in Vercel environment variables.");
    }

    const groq = new Groq({ apiKey });

    let attempts = 0;
    while (uniqueQuestions.length < parsedCount && attempts < 3) {
      attempts++;
      const needed = parsedCount - uniqueQuestions.length;
      
      // Request more than needed in each batch to ensure we have a good pool
      const batchRequestCount = Math.min(needed * 2, 25);

      const currentExclusions = [
        ...excludeList,
        ...uniqueQuestions.map(q => q.question)
      ];

      let excludeSection = "";
      if (currentExclusions.length > 0) {
        excludeSection = `
CRITICAL: DO NOT generate any of the following questions or topics similar to them (they are already generated in the active session):
${currentExclusions.map((q, i) => `- "${q}"`).join("\n")}
Ensure all generated questions are COMPLETELY new, different, and do not repeat any themes or concepts from the list above.
`;
      }

      const prompt = `
Generate EXACTLY ${batchRequestCount} realistic, professional technical interview questions.
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
${experience}

Tech Stack:
${techstack || "Generic"}

Interview Type:
${difficulty}

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

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
      });

      const response = completion.choices[0].message.content;
      const cleaned = response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.warn(`Attempt ${attempts} failed to parse Groq response:`, err);
        continue;
      }

      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (!item || !item.question) continue;
          
          // Strip punctuation and spacing to detect semantic duplicates
          const normalized = item.question.toLowerCase().replace(/[^a-z0-9]/g, "");
          
          if (!seen.has(normalized)) {
            seen.add(normalized);
            uniqueQuestions.push({
              question: item.question,
              answer: item.answer || "",
              difficulty: item.difficulty || "Medium"
            });
          }
        }
      }
    }

    // Slice down to requested count
    const finalQuestions = uniqueQuestions.slice(0, parsedCount);

    if (finalQuestions.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate unique technical questions.",
      });
    }

    res.status(200).json({
      success: true,
      data: finalQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
