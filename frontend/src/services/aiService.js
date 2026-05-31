// Deprecated client-side AI service. All AI operations are proxied securely through the backend.
export const generateAIResponse = async () => {
  throw new Error("Client-side AI generation is disabled for security. Use backend API proxy instead.");
};