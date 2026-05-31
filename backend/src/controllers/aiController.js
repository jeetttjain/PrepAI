import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


export const generateInterview =
async (req, res) => {

  try {

    const {
      role,
      experience,
      techstack,
      difficulty,
      count,
      language,
    } = req.body;

    const targetLang = language || "English";

    const prompt = `
Generate EXACTLY ${count}
realistic interview questions.

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

Interview Type:
${difficulty}

Language:
${targetLang}

Requirements:
- BOTH questions and answers MUST be written in ${targetLang} language.
- Questions must match role
- Questions must match experience level
- Answers should be professional
- Keep answers concise
- No markdown
- No extra text
- Answers should include:
- Short direct explanation
- Detailed explanation
- Real-world example if possible
`;

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        model:
          "llama-3.3-70b-versatile",
      });

    const response =
      completion.choices[0]
      .message.content;

    const cleaned =
      response
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let parsed;

    

try {

  parsed =
    JSON.parse(cleaned);

} catch {

  console.log(cleaned);

  return res.status(500).json({
    success: false,
    message:
      "Invalid AI response format",
  });
}
    res.json({
      success: true,
      data: parsed,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};