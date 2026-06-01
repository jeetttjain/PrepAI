import Groq from "groq-sdk";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

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
      exclude,
    } = req.body;

    const targetLang = language || "English";
    // Strictly cap count at 25
    const parsedCount = Math.min(Math.max(parseInt(count) || 5, 1), 25);
    
    // Request a higher number of extra items to ensure we have enough unique ones after strict deduplication
    const requestCount = Math.min(parsedCount + 10, 35); 

    const excludeList = Array.isArray(exclude) ? exclude.filter(Boolean) : [];
    const excludedSet = new Set(
      excludeList.map(q => q.toLowerCase().replace(/[^a-z0-9]/g, ""))
    );

    let excludeSection = "";
    if (excludeList.length > 0) {
      excludeSection = `
CRITICAL: DO NOT generate any of the following questions or topics similar to them (they are already generated in the active session):
${excludeList.map((q, i) => `- "${q}"`).join("\n")}
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

    const completion =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama-3.3-70b-versatile",
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
      parsed = JSON.parse(cleaned);
    } catch {
      console.log(cleaned);
      return res.status(500).json({
        success: false,
        message: "Invalid AI response format",
      });
    }

    // Programmatic Deduplication Logic (Alpha-numeric normalization comparison)
    const seen = new Set();
    const uniqueQuestions = [];
    
    for (const item of parsed) {
      if (!item || !item.question) continue;
      
      // Strip punctuation and spacing to detect semantic duplicates
      const normalized = item.question.toLowerCase().replace(/[^a-z0-9]/g, "");
      
      // Strict filter: Not in seen (in this batch) and not in excludedSet (previous batches)
      if (!seen.has(normalized) && !excludedSet.has(normalized)) {
        seen.add(normalized);
        uniqueQuestions.push(item);
      }
    }

    // Slice down to requested count
    const finalQuestions = uniqueQuestions.slice(0, parsedCount);

    res.json({
      success: true,
      data: finalQuestions,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const analyzeResume = async (req, res) => {
  try {
    const { role, languages } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No resume file was uploaded.",
      });
    }

    const selectedRole = role || "Full Stack Developer";
    const selectedLanguages = Array.isArray(languages)
      ? languages
      : typeof languages === "string"
      ? JSON.parse(languages)
      : ["English"];

    let extractedText = "";

    // Parse the file depending on its extension/mime-type
    const mime = file.mimetype;
    const originalName = file.originalname.toLowerCase();

    if (mime === "application/pdf" || originalName.endsWith(".pdf")) {
      try {
        const parsed = await pdfParse(file.buffer);
        extractedText = parsed.text;
      } catch (err) {
        console.error("PDF parse error:", err);
        extractedText = file.buffer.toString("utf8");
      }
    } else if (
      mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      originalName.endsWith(".docx")
    ) {
      try {
        const parsed = await mammoth.extractRawText({ buffer: file.buffer });
        extractedText = parsed.value;
      } catch (err) {
        console.error("Word parse error:", err);
        extractedText = file.buffer.toString("utf8");
      }
    } else {
      // Plain text or other text-based format
      extractedText = file.buffer.toString("utf8");
    }

    // Clean extractedText slightly to remove weird binary/control characters
    extractedText = extractedText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
      .trim();

    if (!extractedText || extractedText.length < 20) {
      return res.status(400).json({
        success: false,
        message: "The uploaded file contains insufficient readable text.",
      });
    }

    // Call Groq / Llama-3.3-70b-versatile to analyze the resume
    const prompt = `
You are an expert applicant tracking system (ATS) scanner and recruitment consultant.
Analyze the following resume details for the target job role of: "${selectedRole}".
Also verify if the candidate declares fluency/skills in the following languages: ${selectedLanguages.join(", ")}.

Resume text content:
"""
${extractedText.slice(0, 15000)}
"""

Based on the resume content and target job role, perform a professional evaluation. You must respond with ONLY a valid, parseable JSON object matching the following structure:
{
  "atsScore": 87,
  "targetRole": "${selectedRole}",
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
- "identifiedSkills" must be a list of actual technical/professional skills found in the resume text that are highly relevant to a "${selectedRole}".
- "missingSkills" must be a list of common skills for a "${selectedRole}" that were NOT found or are weak in the resume.
- "tips" must contain exactly 3-4 actionable, high-quality advice items for improving the resume's match for "${selectedRole}".
- "foundLanguages" must consist only of languages from the list of requested languages (${selectedLanguages.join(", ")}) that are mentioned or likely declared in the resume.
- "missingLanguages" must consist of requested languages that are missing.
- "configuredLanguages" must be the exact list requested: [${selectedLanguages.map(l => `"${l}"`).join(", ")}].
- Ensure ONLY valid JSON is returned, without markdown wrappers or extra text.
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

    const analysisResult = JSON.parse(cleaned);

    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Resume analysis controller error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during resume analysis: " + error.message,
    });
  }
};