import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { HelloWorldStack } from '../lib/hello-world-stack';
import { handler, MESSAGE } from '../src/handler';

describe('HelloWorldStack', () => {
  const app = new cdk.App();
  const stack = new HelloWorldStack(app, 'TestStack', {
    env: { account: '123456789012', region: 'us-east-1' },
  });
  const template = Template.fromStack(stack);

  test('creates a Lambda function on Node.js 22', () => {
    template.hasResourceProperties('AWS::Lambda::Function', {
      Runtime: 'nodejs22.x',
      Handler: 'index.handler',
    });
  });

  test('creates an HTTP API with a GET / route', () => {
    template.resourceCountIs('AWS::ApiGatewayV2::Api', 1);
    template.hasResourceProperties('AWS::ApiGatewayV2::Route', {
      RouteKey: 'GET /',
    });
  });

  test('grants API Gateway permission to invoke the Lambda', () => {
    template.hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      Principal: 'apigateway.amazonaws.com',
    });
  });

  test('exports the API URL as an output', () => {
    template.hasOutput('ApiUrl', Match.anyValue());
  });
});

describe('handler', () => {
  test('returns 200 with the hello message as JSON', async () => {
    const result = await handler({} as never);
    expect(result).toMatchObject({ statusCode: 200 });
    const body = JSON.parse((result as { body: string }).body);
    expect(body.message).toBe(MESSAGE);
    expect(typeof body.timestamp).toBe('string');
  });
});
