import * as dotenv from "dotenv";
dotenv.config();

import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../lambda/handlers/get-upload-url/index";

const event: APIGatewayProxyEvent = {
  body: "",
  headers: {
    origin: "http://localhost:5173",
  },
  multiValueHeaders: {},
  httpMethod: "GET",
  isBase64Encoded: false,
  path: "/generate-upload-url",
  pathParameters: null,
  queryStringParameters: {
    filename: "test-file.txt",
  },
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
    path: "/generate-upload-url",
    stage: "test",
    requestId: "test",
    requestTimeEpoch: 1600000000000,
    resourceId: "test",
    resourcePath: "/generate-upload-url",
  },
  resource: "/generate-upload-url",
};

const run = async () => {
  const result = await handler(event);
  console.log(result);
};

run();
