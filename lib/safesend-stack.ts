import * as cdk from "aws-cdk-lib";
import { Duration } from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class SafesendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket to store encrypted files
    const filesBucket = new s3.Bucket(this, "FilesBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedHeaders: ["*"],
          allowedMethods: [s3.HttpMethods.PUT],
          allowedOrigins: ["http://localhost:5173"],
          maxAge: 300,
        },
      ],
    });

    // Create a Lambda function to generate pre-signed URLs for file uploads
    const urlGeneratorLambda = new nodejs.NodejsFunction(
      this,
      "UrlGeneratorLambda",
      {
        runtime: lambda.Runtime.NODEJS_LATEST,
        entry: "lambda/index.ts",
        handler: "handler",
        environment: {
          BUCKET_NAME: filesBucket.bucketName,
          ALLOWED_ORIGIN: "http://localhost:5173",
        },
      }
    );

    // Grant Lambda permissions to put objects in the S3 bucket
    filesBucket.grantPut(urlGeneratorLambda);

    // Create an API Gateway to trigger the Lambda function
    const api = new apigateway.RestApi(this, "SendSafelyApi", {
      restApiName: "SendSafely Prototype Service",
      defaultCorsPreflightOptions: {
        allowOrigins: ["http://localhost:5173"],
        allowMethods: ["GET", "PUT", "OPTIONS"],
        allowHeaders: ["Content-Type", "Origin", "Accept"],
        maxAge: Duration.minutes(5),
      },
    });

    const generateUrlIntegration = new apigateway.LambdaIntegration(
      urlGeneratorLambda
    );
    const generateUrlResource = api.root.addResource("generate-upload-url");
    generateUrlResource.addMethod("GET", generateUrlIntegration, {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    });

    new cdk.CfnOutput(this, "APIEndpoint", {
      value: api.url,
    });

    new cdk.CfnOutput(this, "BucketName", {
      value: filesBucket.bucketName,
    });
  }
}
