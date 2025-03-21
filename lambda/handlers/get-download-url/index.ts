import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BUCKET_NAME, s3Client } from "../../common/s3-client";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event:", JSON.stringify(event, null, 2));
  console.log("BUCKET_NAME:", BUCKET_NAME);

  const key = event.queryStringParameters?.key;

  if (!key) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins for direct testing
        "Access-Control-Allow-Headers": "Content-Type,Origin,Accept",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Max-Age": "300",
      },
      body: JSON.stringify({ error: "Missing key parameter" }),
    };
  }

  try {
    console.log("Creating GetObjectCommand with:", {
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    console.log("Generating signed URL...");
    const downloadURL = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });
    console.log("Generated URL:", downloadURL);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins for direct testing
        "Access-Control-Allow-Headers": "Content-Type,Origin,Accept",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Max-Age": "300",
      },
      body: JSON.stringify({ downloadURL }),
    };
  } catch (error) {
    console.error("Error details:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow all origins for direct testing
        "Access-Control-Allow-Headers": "Content-Type,Origin,Accept",
        "Access-Control-Allow-Methods": "GET,OPTIONS",
        "Access-Control-Max-Age": "300",
      },
      body: JSON.stringify({
        error: (error as Error).message,
        details: error,
      }),
    };
  }
};
