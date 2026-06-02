import axios from "axios";
import { getFunctionUrl } from "./functionUrls";

export const cheatsheetService = {
  generate: async (topic, difficulty) => {
    try {
      const url = getFunctionUrl("generateCheatSheet");
      const response = await axios.post(url, {
        topic,
        difficulty,
      });

      return response.data.data;
    } catch (error) {
      console.error("Cheat Sheet API synthesis failed:", error);
      throw error;
    }
  },
};