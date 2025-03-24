#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { SafesendStack } from "../lib/safesend-stack";

import * as dotenv from "dotenv";

dotenv.config();

const app = new cdk.App();

const allowedOrigins = process.env.ALLOWED_ORIGINS!.split(",");

if (!allowedOrigins) throw new Error("Allowed Origins must be set");

new SafesendStack(app, "SafesendStack", {
  allowedOrigins,
});
