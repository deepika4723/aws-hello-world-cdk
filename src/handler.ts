import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';

// Change this value, then redeploy, to verify the update reaches the public endpoint.
export const MESSAGE = 'Hello from CDK v2!';

export const handler = async (_event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: MESSAGE }),
  };
};
