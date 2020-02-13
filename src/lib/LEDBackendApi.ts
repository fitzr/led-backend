import core = require('@aws-cdk/core')
import apigateway = require('@aws-cdk/aws-apigateway')
import lambda = require('@aws-cdk/aws-lambda')
import path = require('path')
import { Resource } from '@aws-cdk/aws-apigateway/lib/resource'

export default class LEDBackendApi extends core.Construct {
  static API_VERSION = 'v1'

  constructor(scope: core.Construct, id: string) {
    super(scope, id)
    const root = this.createApiRoot()
    this.addHelloApi(root)
    this.addSendMessageApi(root)
  }

  private createApiRoot(): Resource {
    const api = new apigateway.RestApi(this, 'LEDBackendRestApi', {
      restApiName: 'led-backend-api',
      description: 'APIs for LED app.'
    })
    api.addApiKey('LEDBackendRestApiKey')
    return api.root.addResource(LEDBackendApi.API_VERSION)
  }

  private addHelloApi(resource: Resource): void {
    const func = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'Hello.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda'))
    })
    const integration = new apigateway.LambdaIntegration(func, {})
    resource.addResource('hello').addMethod('GET', integration, {
      apiKeyRequired: true
    })
  }

  private addSendMessageApi(resource: Resource): void {
    const func = new lambda.Function(this, 'SendMessageFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'SendMessage.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda'))
    })
    const integration = new apigateway.LambdaIntegration(func, {})
    resource.addResource('send-message').addMethod('POST', integration, {
      apiKeyRequired: true
    })
  }
}
