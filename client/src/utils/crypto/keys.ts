// Simple key derivation: combine server and client secrets.
// In production, use a proper KDF (e.g. PBKDF2) instead.
export const deriveKey = (serverSecret: string, clientSecret: string) => {
  return serverSecret + clientSecret;
};
