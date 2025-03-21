import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "us-east-1", // Explicitly set the region
});

export const BUCKET_NAME = process.env.BUCKET_NAME as string;

if (!BUCKET_NAME) {
  throw new Error("BUCKET_NAME environment variable is not set");
}
