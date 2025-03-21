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
          allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.GET],
          allowedOrigins: ["http://localhost:5173"],
          maxAge: 300,
        },
      ],
      lifecycleRules: [
        {
          expiration: Duration.days(14),
        },
      ],
    });

    // Create Lambda functions for URL generation
    const uploadUrlLambda = new nodejs.NodejsFunction(
      this,
      "UploadUrlGeneratorLambda",
      {
        runtime: lambda.Runtime.NODEJS_LATEST,
        entry: "lambda/handlers/get-upload-url/index.ts",
        handler: "handler",
        environment: {
          BUCKET_NAME: filesBucket.bucketName,
          ALLOWED_ORIGIN: "http://localhost:5173",
        },
      }
    );

    const downloadUrlLambda = new nodejs.NodejsFunction(
      this,
      "DownloadUrlGeneratorLambda",
      {
        runtime: lambda.Runtime.NODEJS_LATEST,
        entry: "lambda/handlers/get-download-url/index.ts",
        handler: "handler",
        environment: {
          BUCKET_NAME: filesBucket.bucketName,
          ALLOWED_ORIGIN: "http://localhost:5173",
        },
      }
    );

    // Grant Lambda permissions
    filesBucket.grantPut(uploadUrlLambda);
    filesBucket.grantRead(downloadUrlLambda);

    // Create an API Gateway to trigger the Lambda functions
    const api = new apigateway.RestApi(this, "SendSafelyApi", {
      restApiName: "SendSafely Prototype Service",
      defaultCorsPreflightOptions: {
        allowOrigins: ["http://localhost:5173"],
        allowMethods: ["GET", "PUT", "OPTIONS"],
        allowHeaders: ["Content-Type", "Origin", "Accept"],
        maxAge: Duration.minutes(5),
      },
    });

    // Upload URL endpoint
    const uploadUrlIntegration = new apigateway.LambdaIntegration(
      uploadUrlLambda
    );
    const uploadUrlResource = api.root.addResource("generate-upload-url");
    uploadUrlResource.addMethod("GET", uploadUrlIntegration, {
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    });

    // Download URL endpoint
    const downloadUrlIntegration = new apigateway.LambdaIntegration(
      downloadUrlLambda
    );
    const downloadUrlResource = api.root.addResource("generate-download-url");
    downloadUrlResource.addMethod("GET", downloadUrlIntegration, {
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
