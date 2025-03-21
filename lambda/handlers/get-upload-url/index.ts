import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BUCKET_NAME, s3Client } from "../../common/s3-client";
import { generateServerSecret } from "../../common/utils";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const key = `uploads/${Date.now()}.enc`;
  const serverSecret = generateServerSecret();

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
      body: JSON.stringify({ uploadURL, key, serverSecret }),
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
