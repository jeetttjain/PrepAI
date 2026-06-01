import axios from "axios";
import { getFunctionUrl } from "./functionUrls";

export const cheatsheetService = {
  generate: async (topic, difficulty) => {
    const url = getFunctionUrl("generateCheatSheet");
    const response = await axios.post(url, {
      topic,
      difficulty,
    });

    return response.data.data;
  },
};