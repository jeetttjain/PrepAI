import axios from "axios";

const getGroqApiKey = () => {
  return import.meta.env.VITE_GROQ_API_KEY || "";
};

export const aiService = {
  /**
   * Helper to perform direct browser calls to Groq API.
   * @param {Array} messages - Chat messages array
   * @param {string} model - Groq model to run (defaults to Llama-3.3-70b)
   * @param {number} temperature - Response temperature (0.0 to 1.0)
   * @returns {Promise<string>} - AI response content
   */
  callGroq: async (messages, model = "llama-3.3-70b-versatile", temperature = 0.7) => {
    try {
      const apiKey = getGroqApiKey();
      if (!apiKey) {
        throw new Error("No Groq API Key is configured in the environment.");
      }

      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model,
          messages,
          temperature,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].message.content;
      }

      throw new Error("Invalid response format received from Groq API.");
    } catch (err) {
      console.error("Direct Groq API Call failed:", err);
      // Clean up error message if API key is in the URI or log
      const msg = err.response?.data?.error?.message || err.message || "Unknown error";
      throw new Error(msg);
    }
  },
};