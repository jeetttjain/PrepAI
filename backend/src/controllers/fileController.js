import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const parseRTF = (rtfStr) => {
  let text = rtfStr;
  text = text.replace(/\\rtf1[\s\S]*?/g, "");
  text = text.replace(/\{\*?\\[^{}]*\}/g, "");
  text = text.replace(/\\([a-z]{1,32})(-?\d+)? ?/g, " ");
  text = text.replace(/\\'/g, ""); 
  text = text.replace(/[{}]/g, "");
  return text.replace(/\s+/g, " ").trim();
};

const parseDOC = (buffer) => {
  const rawText = buffer.toString("binary");
  const matches = rawText.match(/[\x20-\x7E\x0A\x0D]{4,}/g);
  if (matches) {
    return matches
      .map(m => m.trim())
      .filter(m => m.length > 5 && !/^[0-9\s]+$/.test(m) && !/[{}<>\\|_^~]/.test(m))
      .join("\n");
  }
  return buffer.toString("utf8").replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ").trim();
};

export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, message: "No file was uploaded." });
    }

    let extractedText = "";
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
    } else if (originalName.endsWith(".doc")) {
      extractedText = parseDOC(file.buffer);
    } else if (originalName.endsWith(".rtf")) {
      extractedText = parseRTF(file.buffer.toString("utf8"));
    } else {
      extractedText = file.buffer.toString("utf8");
    }

    extractedText = extractedText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
      .trim();

    res.json({
      success: true,
      extractedText,
      name: file.originalname,
      size: file.buffer.length,
    });
  } catch (err) {
    console.error("Upload document controller error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
