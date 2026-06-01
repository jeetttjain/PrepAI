import axios from "axios";
import { getFunctionUrl } from "./functionUrls";

export const resumeService = {
  analyze: async (file, role, languages = []) => {
    const url = getFunctionUrl("analyzeResume");
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);
    formData.append("languages", JSON.stringify(languages));

    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },
};
