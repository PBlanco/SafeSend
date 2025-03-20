import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const s3Client = new S3Client({});
const BUCKET_NAME = process.env.BUCKET_NAME as string;
if (!BUCKET_NAME) {
  throw new Error("BUCKET_NAME environment variable is not set");
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const key = `uploads/${Date.now()}.enc`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const uploadURL = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type,Origin,Accept",
        "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
        "Access-Control-Max-Age": "300", // 5 minutes
      },
      body: JSON.stringify({ uploadURL, key }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Headers": "Content-Type,Origin,Accept",
        "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
        "Access-Control-Max-Age": "300",
      },
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
