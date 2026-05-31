import axios from "axios";

const API =
  "http://localhost:5000/api/ai";

export const interviewService = {

  generate: async (
    role,
    level,
    type,
    count
  ) => {

    const response =
      await axios.post(
        `${API}/generate-interview`,
        {
          role,
          experience: level,
          techstack: type,
          difficulty: "Medium",
          count,
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
            "AI Generated Interview Question",
        })
      );

    return {
      id:
        `question-${index}`,

      role,

      level,

      questions,
    };
  },
};