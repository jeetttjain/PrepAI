import axios from "axios";
import { getFunctionUrl } from "./functionUrls";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fileService = {
  upload: async (file, onProgress) => {
    // In order to show a responsive animated upload UI:
    onProgress(20);
    await delay(300);
    onProgress(60);

    try {
      const url = getFunctionUrl("uploadDocument");
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      onProgress(100);

      return {
        id: 'file_' + Date.now(),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        status: 'Ready',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        fileContent: response.data.extractedText
      };
    } catch (err) {
      console.error("Real document parsing failed:", err);
      onProgress(100);
      throw err;
    }
  },

  getChatResponse: async (filename, userMessage, fileContent = "") => {
    try {
      const url = getFunctionUrl("aiChat");
      const response = await axios.post(url, {
        filename,
        userMessage,
        fileContent
      });

      return response.data.data;
    } catch (err) {
      console.error("Secure AI Chat Function failed:", err);
      throw err;
    }
  }
};
