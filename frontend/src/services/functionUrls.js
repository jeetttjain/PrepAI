const PROJECT_ID = "prepai-38233";
const REGION = "us-central1";

export const getFunctionUrl = (functionName) => {
  // Support custom VITE env vars if configured
  const envVar = import.meta.env[`VITE_FUNC_${functionName.toUpperCase()}`];
  if (envVar) return envVar;

  // Auto-detect environment to toggle emulators or cloud server routes
  const isLocal = window.location.hostname === "localhost";
  
  if (isLocal) {
    return `http://localhost:5001/${PROJECT_ID}/${REGION}/${functionName}`;
  }
  
  return `https://${REGION}-${PROJECT_ID}.cloudfunctions.net/${functionName}`;
};
