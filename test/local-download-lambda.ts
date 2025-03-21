import * as dotenv from "dotenv";
dotenv.config();
console.log("BUCKET_NAME in local-lambda.ts", process.env.BUCKET_NAME);

import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../lambda/handlers/get-download-url/index";

const event: APIGatewayProxyEvent = {
  body: "",
  headers: {},
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/generate-download-url",
  pathParameters: null,
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: {
    accountId: "123456789012",
    apiId: "test",
    authorizer: {},
    protocol: "HTTP/1.1",
    httpMethod: "GET",
    identity: {
      accessKey: null,
      accountId: null,
      apiKey: null,
      apiKeyId: null,
      caller: null,
      clientCert: null,
      cognitoAuthenticationProvider: null,
      cognitoAuthenticationType: null,
      cognitoIdentityId: null,
      cognitoIdentityPoolId: null,
      principalOrgId: null,
      sourceIp: "127.0.0.1",
      user: null,
      userAgent: null,
      userArn: null,
    },
    path: "/generate-download-url",
    stage: "test",
    requestId: "test",
    requestTimeEpoch: 1600000000000,
    resourceId: "test",
    resourcePath: "/generate-download-url",
  },
  resource: "/generate-download-url",
};

const run = async () => {
  const result = await handler(event);
  console.log(result);
};

run();
