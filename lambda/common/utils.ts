import { randomBytes } from "crypto";

export const generateServerSecret = () => {
  return randomBytes(32).toString("hex");
};
