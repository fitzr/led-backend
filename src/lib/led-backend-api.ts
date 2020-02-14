import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigateway from '@aws-cdk/aws-apigateway'
import { CdkUtils } from './cdk-utils'

export class LedBackendApi extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)
    const api = this.createApi(scope)
    const resource = this.addApiVersion(scope, api)
    this.addHelloMethod(resource)
    this.addSendMessageMethod(resource)
  }

  private createApi(scope: cdk.Construct): apigateway.RestApi {
    const env = CdkUtils.getEnv(scope)
    const api = new apigateway.RestApi(this, 'RestApi', {
      restApiName: `led-backend-api-${env}`,
      description: 'APIs for LED app.',
      deployOptions: {
        stageName: env
      }
    })
    const key = api.addApiKey('ApiKey')
    const plan = api.addUsagePlan('UsagePlan', {
      name: 'no-throttle',
      apiKey: key
    })
    plan.addApiStage({ stage: api.deploymentStage })
    return api
  }

  private addApiVersion(
    scope: cdk.Construct,
    api: apigateway.RestApi
  ): apigateway.Resource {
    const apiVersion = scope.node.tryGetContext('apiVersion') || 'v1'
    return api.root.addResource(apiVersion)
  }

  private addHelloMethod(resource: apigateway.Resource): void {
    const func = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'Hello.handler',
      code: lambda.Code.fromAsset('src/lambda')
    })
    const integration = new apigateway.LambdaIntegration(func, {})
    resource.addResource('hello').addMethod('GET', integration, {
      apiKeyRequired: true
    })
  }

  private addSendMessageMethod(resource: apigateway.Resource): void {
    const func = new lambda.Function(this, 'SendMessageFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'SendMessage.handler',
      code: lambda.Code.fromAsset('src/lambda')
    })
    const integration = new apigateway.LambdaIntegration(func, {})
    resource.addResource('send-message').addMethod('POST', integration, {
      apiKeyRequired: true
    })
  }
}
