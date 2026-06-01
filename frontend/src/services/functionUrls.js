export const getFunctionUrl = (functionName) => {
  // Support custom VITE env vars if configured
  const envVar = import.meta.env[`VITE_FUNC_${functionName.toUpperCase()}`];
  if (envVar) return envVar;

  return `/api/${functionName}`;
};
