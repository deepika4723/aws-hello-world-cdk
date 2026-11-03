#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { HelloWorldStack } from '../lib/hello-world-stack';

const app = new cdk.App();

new HelloWorldStack(app, 'HelloWorldStack', {
  // Account and region come from the active AWS credentials (for example, the GitHub OIDC role).
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
  },
  description: 'Hello World: Lambda behind API Gateway HTTP API',
});
