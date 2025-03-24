import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { BUCKET_NAME, s3Client } from "../../common/s3-client";
import { createLambdaResponse, generateServerSecret } from "../../common/utils";

const EXPIRES_IN = 300; // 5 minutes

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const key = `uploads/${Date.now()}.enc`;
  const serverSecret = generateServerSecret();
  const origin = event.headers.origin || "";
  const filename = event.queryStringParameters?.filename || "filename";

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Metadata: {
        "original-filename": filename,
      },
    });

    const uploadURL = await getSignedUrl(s3Client, command, {
      expiresIn: EXPIRES_IN,
    });

    return createLambdaResponse(origin, 200, {
      uploadURL,
      key,
      serverSecret,
    });
  } catch (error) {
    return createLambdaResponse(origin, 500, {
      error: (error as Error).message,
    });
  }
};
