import * as path from 'path';
import { CfnOutput, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class HelloWorldStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloFunction = new NodejsFunction(this, 'HelloFunction', {
      entry: path.join(__dirname, '..', 'src', 'handler.ts'),
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      memorySize: 128,
      timeout: Duration.seconds(10),
      bundling: { minify: true, sourceMap: true },
    });

    const httpApi = new apigatewayv2.HttpApi(this, 'HelloHttpApi', {
      apiName: 'hello-world-api',
      description: 'Public HTTPS endpoint for the Hello World Lambda',
    });

    httpApi.addRoutes({
      path: '/',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new HttpLambdaIntegration('HelloIntegration', helloFunction),
    });

    new CfnOutput(this, 'ApiUrl', {
      value: httpApi.apiEndpoint,
      description: 'Public HTTPS endpoint. Open this URL in a browser.',
    });
  }
}
