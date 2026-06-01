import axios from "axios";

const API_HOST = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API = `${API_HOST}/ai`;

export const interviewService = {

  generate: async (
    role,
    level,
    type,
    count,
    language = "English",
    exclude = []
  ) => {

    const response =
      await axios.post(
        `${API}/generate-interview`,
        {
          role,

          experience:
            level,

          techstack:
            type,

          difficulty:
            type,

          count,

          language,
          exclude,
        }
      );

    const questions =
      response.data.data.map(
        (item, index) => ({

          id:
            crypto.randomUUID(),

          number:
            `Q${index + 1}`,

          difficulty:
            item.difficulty ||
            "Medium",

          question:
            item.question,

          answer:
            item.answer,

          context:
            `${type} Interview Question`,
        })
      );

    return {

      id:
        crypto.randomUUID(),

      role,

      level,

      questions,

      language,
    };
  },
};