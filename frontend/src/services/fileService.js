import { clientParser } from "./clientParser";
import { aiService } from "./aiService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fileService = {
  upload: async (file, onProgress) => {
    // In order to show a responsive animated upload UI:
    onProgress(20);
    await delay(200);
    onProgress(60);

    try {
      const extractedText = await clientParser.parse(file);
      onProgress(100);

      return {
        id: 'file_' + Date.now(),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        status: 'Ready',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        fileContent: extractedText
      };
    } catch (err) {
      console.error("Real document parsing failed:", err);
      onProgress(100);
      throw err;
    }
  },

  getChatResponse: async (filename, userMessage, fileContent = "") => {
    try {
      let systemPrompt = "You are an expert technical assistant, study mentor, and career consultant. ";
      if (fileContent) {
        systemPrompt += `You have access to the contents of a study document uploaded by the user named "${filename}". Answer the user's queries accurately, in detail, using the context of the document. Keep your formatting clean and professional with markdown. Document contents:\n\n${fileContent.slice(
          0,
          15000
        )}`;
      } else {
        systemPrompt += `The user has not uploaded a document yet. Answer the user's queries using your general technical knowledge. Keep your formatting clean and professional with markdown.`;
      }

      return await aiService.callGroq(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        "llama-3.3-70b-versatile",
        0.7
      );
    } catch (err) {
      console.error("Secure AI Chat Function failed:", err);
      throw err;
    }
  }
};
