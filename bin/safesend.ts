#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { SafesendStack } from "../lib/safesend-stack";

import * as dotenv from "dotenv";

dotenv.config();

const app = new cdk.App();

const allowedOrigins = process.env.ALLOWED_ORIGINS!.split(",");
if (!allowedOrigins)
  throw new Error("Allowed Origins must be set. Set ALLOWED_ORIGINS in .env");

const maxFileSize = process.env.MAX_FILE_SIZE;
if (!maxFileSize)
  throw new Error("Max File Size must be set. Set MAX_FILE_SIZE in .env");

new SafesendStack(app, "SafesendStack", {
  allowedOrigins,
  expirationDays: 1,
  maxFileSize,
});
