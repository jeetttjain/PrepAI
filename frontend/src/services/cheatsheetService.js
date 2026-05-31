import axios from "axios";

const API_HOST = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = `${API_HOST}/cheatsheet`;

export const cheatsheetService = {

  generate: async (
    topic,
    difficulty
  ) => {

    const response =
      await axios.post(
        `${API}/generate`,
        {
          topic,
          difficulty,
        }
      );

    return response.data.data;
  },
};