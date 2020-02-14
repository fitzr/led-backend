import { Construct } from '@aws-cdk/core'
import { Code, Runtime, Function } from '@aws-cdk/aws-lambda'
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway'
import { Resource } from '@aws-cdk/aws-apigateway/lib/resource'
import CDKUtils from './CDKUtils'
import path = require('path')

export default class LEDBackendApi extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id)
    const apiVersion = scope.node.tryGetContext('apiVersion') || 'v1'
    const api = this.createApi(scope)
    const resource = api.root.addResource(apiVersion)
    this.addHelloApi(resource)
    this.addSendMessageApi(resource)
  }

  private createApi(scope: Construct): RestApi {
    const env = CDKUtils.getEnv(scope)
    const api = new RestApi(this, 'RestApi', {
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

  private addHelloApi(resource: Resource): void {
    const func = new Function(this, 'HelloFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'Hello.handler',
      code: Code.fromAsset(path.join(__dirname, '../lambda'))
    })
    const integration = new LambdaIntegration(func, {})
    resource.addResource('hello').addMethod('GET', integration, {
      apiKeyRequired: true
    })
  }

  private addSendMessageApi(resource: Resource): void {
    const func = new Function(this, 'SendMessageFunction', {
      runtime: Runtime.NODEJS_12_X,
      handler: 'SendMessage.handler',
      code: Code.fromAsset(path.join(__dirname, '../lambda'))
    })
    const integration = new LambdaIntegration(func, {})
    resource.addResource('send-message').addMethod('POST', integration, {
      apiKeyRequired: true
    })
  }
}
