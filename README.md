# Hello World on AWS Lambda and API Gateway (AWS CDK, TypeScript)

A minimal AWS CDK v2 app. One Lambda function sits behind a public HTTPS endpoint (API Gateway HTTP API).

```
GET https://<api-id>.execute-api.us-east-1.amazonaws.com/
→ {"message":"Hello, World!","timestamp":"..."}
```

## Project structure

```
hello-world-cdk/
├── bin/app.ts                      # CDK app entry point
├── lib/hello-world-stack.ts        # Lambda + HTTP API + output with the URL
├── src/handler.ts                  # Lambda code (edit MESSAGE here to change the response)
├── test/hello-world.test.ts        # Jest tests (stack assertions + handler)
├── .github/workflows/deploy.yml    # Build, test, deploy via OIDC, verify endpoint
├── cdk.json
├── package.json
└── tsconfig.json
```

## Local development

```bash
npm install
npm run build
npm test
CDK_DEFAULT_ACCOUNT=<account-id> CDK_DEFAULT_REGION=us-east-1 npx cdk synth
```

## One-time setup for the target account

The deploy goes to a **member sandbox account**, not the management account.

1. **Bootstrap** the CDK in that account and region (requires admin credentials for that account):
   ```bash
   npx cdk bootstrap aws://<SANDBOX_ACCOUNT_ID>/us-east-1
   ```
2. **Trust the GitHub OIDC role.** The role must trust this repository and the `sandbox` GitHub environment. Its `sub` claim looks like `repo:<owner>/hello-world-cdk:environment:sandbox`. The role needs permission to deploy the stack (CloudFormation, Lambda, API Gateway, IAM for the Lambda execution role, and CloudWatch Logs), and to assume the `cdk-hnb659fds-*` bootstrap roles in that account.
3. **Create the GitHub environment** `sandbox` (repo Settings → Environments), with required reviewers if you want an approval gate.
4. **Set the repository variable** `AWS_DEPLOY_ROLE_ARN` (Settings → Secrets and variables → Actions → Variables) to that role's ARN.

## CI/CD

Two GitHub Actions workflows:

- **CI** (`.github/workflows/ci.yml`) runs on every pull request and every push. It compiles, runs the tests, and synthesizes the template. It uses no AWS credentials, so untrusted pull requests never reach the deploy role.
- **Deploy** (`.github/workflows/deploy.yml`) runs on pushes to `main` and on manual dispatch. It assumes the OIDC role, deploys to the `sandbox` environment, and checks the live endpoint.

## Deploy

Push to `main`, or run the **Deploy** workflow manually. The workflow:

1. Installs, compiles, and runs unit tests
2. Shows `cdk diff`, then deploys
3. Calls the public URL and fails unless it returns the message from `src/handler.ts`

To deploy by hand:

```bash
npx cdk deploy
```

The stack prints the `ApiUrl` output. Open that URL in a browser to see the response.

## Change the response and redeploy

1. Edit `MESSAGE` in `src/handler.ts`, for example to `'Hello from CDK v2!'`
2. `npm test`, then commit and push to `main` (or run `npx cdk deploy` locally)
3. Reload the URL. The `message` field now shows the new text.

## Clean up

```bash
npx cdk destroy
```
