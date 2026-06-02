import axios from "axios";
import { getFunctionUrl } from "./functionUrls";

export const interviewService = {

  generate: async (
    role,
    level,
    type,
    count,
    language = "English",
    exclude = []
  ) => {
    try {
      const url = getFunctionUrl("generateQuestions");
      const response =
        await axios.post(
          url,
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
    } catch (error) {
      console.error("Interview API synthesis failed:", error);
      throw error;
    }
  },
};