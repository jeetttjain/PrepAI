import Groq from "groq-sdk";
import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import busboy from "busboy";

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

    req.pipe(bb);
  });
};

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

    const analysisResult = JSON.parse(cleaned);

    res.status(200).json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
