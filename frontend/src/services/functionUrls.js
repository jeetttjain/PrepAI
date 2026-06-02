export const getFunctionUrl = (functionName) => {
  // Support custom VITE env vars if configured
  const envVar = import.meta.env[`VITE_FUNC_${functionName.toUpperCase()}`];
  if (envVar) return envVar;

  const baseUrl = import.meta.env.VITE_API_URL || "";
  const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;

  if (cleanBase) {
    return `${cleanBase}/${functionName}`;
  }

  return `/api/${functionName}`;
};
