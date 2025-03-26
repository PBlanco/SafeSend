import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
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
  const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || "5242880");

  try {
    const post = await createPresignedPost(s3Client, {
      Bucket: BUCKET_NAME,
      Key: key,
      Conditions: [
        ["content-length-range", 0, maxFileSize],
        { "x-amz-meta-original-filename": filename },
      ],
      Expires: EXPIRES_IN,
      Fields: {
        "x-amz-meta-original-filename": filename,
      },
    });

    return createLambdaResponse(origin, 200, {
      post,
      key,
      serverSecret,
    });
  } catch (error) {
    return createLambdaResponse(origin, 500, {
      error: (error as Error).message,
    });
  }
};
