import { randomBytes } from "crypto";

export const generateServerSecret = () => {
  return randomBytes(32).toString("hex");
};

export const createLambdaResponse = (
  origin: string,
  statusCode: number,
  body: any
) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
  if (allowedOrigins.length === 0) {
    throw new Error("ALLOWED_ORIGINS environment variable is not set");
  }

  // Check if the origin is in the allowed list
  const isValidOrigin = allowedOrigins.includes(origin);

  // If origin is not valid, log it for debugging
  if (!isValidOrigin) {
    console.log("Invalid origin:", origin);
    console.log("Allowed origins:", allowedOrigins);
  }

  // For invalid origins, return a 403 status with appropriate headers
  if (!isValidOrigin) {
    return {
      statusCode: 403,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigins[0],
        "Access-Control-Allow-Headers": "Content-Type,Origin,Accept",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Max-Age": "300",
      },
      body: JSON.stringify({ error: "Origin not allowed" }),
    };
  }

  // For valid origins, return the requested data with appropriate CORS headers
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": origin || allowedOrigins[0],
      "Access-Control-Allow-Headers": "Content-Type,Origin,Accept",
      "Access-Control-Allow-Methods": "GET,OPTIONS",
      "Access-Control-Max-Age": "300",
    },
    body: JSON.stringify(body),
  };
};
