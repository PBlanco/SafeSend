import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BUCKET_NAME, s3Client } from "../../common/s3-client";
import { createLambdaResponse } from "../../common/utils";

const EXPIRES_IN = 300; // 5 minutes

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const key = event.queryStringParameters?.key;
  const origin = event.headers.origin || "";

  if (!key) {
    return createLambdaResponse(origin, 400, {
      error: "Missing key parameter",
    });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const downloadURL = await getSignedUrl(s3Client, command, {
      expiresIn: EXPIRES_IN,
    });

    return createLambdaResponse(origin, 200, { downloadURL });
  } catch (error) {
    return createLambdaResponse(origin, 500, {
      error: (error as Error).message,
      details: error,
    });
  }
};
