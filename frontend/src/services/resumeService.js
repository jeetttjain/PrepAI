import axios from "axios";

const API_HOST = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = `${API_HOST}/ai`;

export const resumeService = {
  analyze: async (file, role, languages = []) => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("role", role);
    formData.append("languages", JSON.stringify(languages));

    const response = await axios.post(`${API}/analyze-resume`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },
};
