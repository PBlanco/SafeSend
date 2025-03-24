import { randomBytes } from "crypto";

export const generateServerSecret = () => {
  return randomBytes(32).toString("hex");
};

export const createLambdaResponse = (
  origin: string,
  statusCode: number,
  body: any
) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");
  if (!allowedOrigins) {
    throw new Error("ALLOWED_ORIGINS environment variable is not set");
  }

  const isValidOrigin = allowedOrigins.includes(origin);
  if (!isValidOrigin) {
    console.log("Invalid origin", origin);
  }

  const validOrigin = isValidOrigin ? origin : allowedOrigins[0];

  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": validOrigin,
      "Access-Control-Allow-Headers": "Content-Type,Origin,Accept",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Max-Age": "300",
    },
    body: JSON.stringify(body),
  };
};
