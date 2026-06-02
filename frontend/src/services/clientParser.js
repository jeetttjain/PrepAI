const loadJSZip = () => {
  return new Promise((resolve, reject) => {
    if (window.JSZip) {
      resolve(window.JSZip);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";
    script.onload = () => resolve(window.JSZip);
    script.onerror = () => reject(new Error("Failed to load JSZip from CDN."));
    document.head.appendChild(script);
  });
};

const parseRTF = (raw) => {
  let text = raw.replace(/\\{[^}]*}/g, "");
  text = text.replace(/\\[a-z0-9*-]+(?:\s|;)?/gi, "");
  text = text.replace(/[{}]/g, "");
  text = text.replace(/\\'([0-9a-f]{2})/gi, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });
  return text.replace(/\s+/g, " ").trim();
};

const parseDOCX = async (file) => {
  const JSZip = await loadJSZip();
  const zip = await JSZip.loadAsync(file);
  const docFile = zip.file("word/document.xml");
  if (!docFile) {
    throw new Error("Invalid DOCX format: missing word/document.xml");
  }
  const docXml = await docFile.async("text");
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(docXml, "text/xml");
  const paragraphs = xmlDoc.getElementsByTagName("w:p");
  let text = "";
  for (let i = 0; i < paragraphs.length; i++) {
    const texts = paragraphs[i].getElementsByTagName("w:t");
    let pText = "";
    for (let j = 0; j < texts.length; j++) {
      pText += texts[j].textContent;
    }
    if (pText) {
      text += pText + "\n";
    }
  }
  return text.trim();
};

const parseDOC = async (file) => {
  const buffer = await file.arrayBuffer();
  const arr = new Uint8Array(buffer);
  let text = "";
  let word = "";
  for (let i = 0; i < arr.length; i++) {
    const code = arr[i];
    if ((code >= 32 && code <= 126) || code === 9 || code === 10 || code === 13) {
      word += String.fromCharCode(code);
    } else {
      if (word.length > 4) {
        if (
          !word.includes("WordDocument") &&
          !word.includes("SummaryInformation") &&
          !word.includes("DocumentSummaryInformation") &&
          !word.includes("CompObj") &&
          !word.includes("ObjectPool")
        ) {
          text += word + " ";
        }
      }
      word = "";
    }
  }
  if (word.length > 4) {
    text += word;
  }
  return text.replace(/\s+/g, " ").trim();
};

const parsePDF = async (file) => {
  const buffer = await file.arrayBuffer();
  const arr = new Uint8Array(buffer);
  let str = "";
  for (let i = 0; i < arr.length; i++) {
    str += String.fromCharCode(arr[i]);
  }
  const btRegex = /BT[\s\S]*?ET/g;
  const matches = str.match(btRegex);
  let text = "";
  if (matches) {
    for (const block of matches) {
      const tjRegex = /\((.*?)\)\s*Tj/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(block)) !== null) {
        text += tjMatch[1] + " ";
      }
      const tjArrRegex = /\[([\s\S]*?)\]\s*TJ/g;
      let tjArrMatch;
      while ((tjArrMatch = tjArrRegex.exec(block)) !== null) {
        const content = tjArrMatch[1];
        const stringsRegex = /\((.*?)\)/g;
        let strMatch;
        while ((strMatch = stringsRegex.exec(content)) !== null) {
          text += strMatch[1];
        }
        text += " ";
      }
    }
  }
  text = text
    .replace(/\\([\(\)\\])/g, "$1")
    .replace(/\\r/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t");

  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "").trim();

  if (!text || text.length < 20) {
    const parenRegex = /\(([^)]+)\)/g;
    let pMatch;
    let cleanText = "";
    while ((pMatch = parenRegex.exec(str)) !== null) {
      const val = pMatch[1].trim();
      if (val.length > 3 && /^[a-zA-Z0-9\s,.:;!?-]+$/.test(val)) {
        cleanText += val + " ";
      }
    }
    text = cleanText.trim();
  }
  return text;
};

export const clientParser = {
  parse: async (file) => {
    const name = file.name.toLowerCase();
    
    if (name.endsWith(".txt") || name.endsWith(".md")) {
      return await file.text();
    } else if (name.endsWith(".rtf")) {
      const raw = await file.text();
      return parseRTF(raw);
    } else if (name.endsWith(".docx")) {
      return await parseDOCX(file);
    } else if (name.endsWith(".doc")) {
      return await parseDOC(file);
    } else if (name.endsWith(".pdf")) {
      return await parsePDF(file);
    } else {
      // General plaintext fallback
      return await file.text();
    }
  }
};
