export const getFunctionUrl = (functionName) => {
  // Support custom VITE env vars if configured
  const envVar = import.meta.env[`VITE_FUNC_${functionName.toUpperCase()}`];
  if (envVar) return envVar;

  const baseUrl = import.meta.env.VITE_API_URL || "";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  // In production hosting (not localhost), if baseUrl is empty or points to localhost, 
  // default to relative paths to allow Firebase Hosting rewrites.
  if (
    typeof window !== "undefined" &&
    window.location &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    if (!cleanBase || cleanBase.includes("localhost") || cleanBase.includes("127.0.0.1")) {
      return `/api/${functionName}`;
    }
  }

  if (cleanBase) {
    return `${cleanBase}/${functionName}`;
  }

  return `/api/${functionName}`;
};
