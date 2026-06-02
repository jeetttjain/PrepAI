import mammoth from "mammoth";
import pdfParse from "pdf-parse";
import busboy from "busboy";

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

const parseMultipart = (req) => {
  return new Promise((resolve, reject) => {
    const fields = {};
    let fileBuffer = null;
    let fileName = "";
    let fileMime = "";

    const bb = busboy({ headers: req.headers, limits: { fileSize: 20 * 1024 * 1024 } });

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

    res.status(200).json({
      success: true,
      extractedText,
      name: file.name,
      size: file.buffer.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}
