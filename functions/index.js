import * as functions from "firebase-functions";
import cors from "cors";
import Groq from "groq-sdk";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import busboy from "busboy";

const corsHandler = cors({ origin: true });

// Helper to parse multipart/form-data inside Cloud Functions
const parseMultipart = (req) => {
  return new Promise((resolve, reject) => {
    const fields = {};
    let fileBuffer = null;
    let fileName = "";
    let fileMime = "";

    const bb = busboy({ headers: req.headers });

    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;
      fileName = filename;
      fileMime = mimeType;
      const chunks = [];
      file.on("data", (data) => {
        chunks.push(data);
      });
      file.on("end", () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    bb.on("field", (name, val) => {
      fields[name] = val;
    });

    bb.on("finish", () => {
      resolve({
        fields,
        file: fileBuffer
          ? { buffer: fileBuffer, name: fileName, mime: fileMime }
          : null,
      });
    });

    bb.on("error", (err) => {
      reject(err);
    });

    if (req.rawBody) {
      bb.end(req.rawBody);
    } else {
      req.pipe(bb);
    }
  });
};

// 1. generateQuestions Cloud Function
export const generateQuestions = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
      const parsedCount = Math.min(Math.max(parseInt(count) || 5, 1), 25);
      const requestCount = Math.min(parsedCount + 10, 35);

      const excludeList = Array.isArray(exclude) ? exclude.filter(Boolean) : [];
      const excludedSet = new Set(
        excludeList.map((q) => q.toLowerCase().replace(/[^a-z0-9]/g, ""))
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

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("GROQ_API_KEY is not defined in functions environment variables.");
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

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        return res.status(500).json({
          success: false,
          message: "Invalid AI response format",
        });
      }

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

      res.json({
        success: true,
        data: finalQuestions,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// 2. analyzeResume Cloud Function
export const analyzeResume = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
      const { fields, file } = await parseMultipart(req);
      if (!file) {
        return res.status(400).json({
          success: false,
          message: "No resume file was uploaded.",
        });
      }

      const role = fields.role || "Full Stack Developer";
      const languages = fields.languages
        ? JSON.parse(fields.languages)
        : ["English"];

      let extractedText = "";
      const mime = file.mime;
      const originalName = file.name.toLowerCase();

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
        extractedText = file.buffer.toString("utf8");
      }

      extractedText = extractedText
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
        .trim();

      if (!extractedText || extractedText.length < 20) {
        return res.status(400).json({
          success: false,
          message: "The uploaded file contains insufficient readable text.",
        });
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

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("GROQ_API_KEY is not defined in functions environment variables.");
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

      const analysisResult = JSON.parse(cleaned);

      res.json({
        success: true,
        data: analysisResult,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// 3. generateCheatSheet Cloud Function
export const generateCheatSheet = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
        throw new Error("GROQ_API_KEY is not defined in functions environment variables.");
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

      res.json({
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
  });
});

// 4. generateRoadmap Cloud Function
export const generateRoadmap = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
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
        throw new Error("GROQ_API_KEY is not defined in functions environment variables.");
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

      res.json({
        success: true,
        data: parsedRoadmap,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  });
});

// 5. uploadDocument Cloud Function
export const uploadDocument = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
      const { file } = await parseMultipart(req);
      if (!file) {
        return res.status(400).json({ success: false, message: "No file was uploaded." });
      }

      let extractedText = "";
      const mime = file.mime;
      const originalName = file.name.toLowerCase();

      if (mime === "application/pdf" || originalName.endsWith(".pdf")) {
        const parsed = await pdfParse(file.buffer);
        extractedText = parsed.text;
      } else if (
        mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        originalName.endsWith(".docx")
      ) {
        const parsed = await mammoth.extractRawText({ buffer: file.buffer });
        extractedText = parsed.value;
      } else {
        extractedText = file.buffer.toString("utf8");
      }

      extractedText = extractedText
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
        .trim();

      res.json({
        success: true,
        extractedText,
        name: file.name,
        size: file.buffer.length,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });
});

// 6. aiChat Cloud Function
export const aiChat = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, message: "Method Not Allowed" });
    }

    try {
      const { filename, userMessage, fileContent } = req.body;

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        throw new Error("GROQ_API_KEY is not defined in functions environment variables.");
      }

      let systemPrompt = "You are an expert technical assistant, study mentor, and career consultant. ";
      if (fileContent) {
        systemPrompt += `You have access to the contents of a study document uploaded by the user named "${filename}". Answer the user's queries accurately, in detail, using the context of the document. Keep your formatting clean and professional with markdown. Document contents:\n\n${fileContent.slice(
          0,
          15000
        )}`;
      } else {
        systemPrompt += `The user has not uploaded a document yet. Answer the user's queries using your general technical knowledge. Keep your formatting clean and professional with markdown.`;
      }

      const groq = new Groq({ apiKey });
      const completion = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
      });

      res.json({
        success: true,
        data: completion.choices[0].message.content,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  });
});
