import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigateway from '@aws-cdk/aws-apigateway'
import { CdkUtils } from './cdk-utils'

export class LedBackendApi extends cdk.Construct {
  static readonly API_VERSION = 'v1'

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)
    const env = CdkUtils.getEnv(scope)
    const api = this.createApi(env)
    const resource = api.root.addResource(LedBackendApi.API_VERSION)
    this.addHelloMethod(resource, env)
    // this.addSendMessageMethod(resource, env)
  }

  private createApi(env: string): apigateway.RestApi {
    const api = new apigateway.RestApi(this, 'RestApi', {
      restApiName: `led-backend-api-${env}`,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        statusCode: 200
      },
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

  private addHelloMethod(resource: apigateway.Resource, env: string): void {
    const func = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'hello.handler',
      code: lambda.Code.fromAsset('src/lambda')
    })
    const integration = new apigateway.LambdaIntegration(func, {
      integrationResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers':
              "'Content-Type,X-Api-Key'",
            'method.response.header.Access-Control-Allow-Origin': "'*'",
            'method.response.header.Access-Control-Allow-Methods':
              "'OPTIONS,GET'"
          }
        }
      ],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      proxy: false,
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    })
    resource.addResource('hello').addMethod('GET', integration, {
      methodResponses: [
        {
          statusCode: '200',
          responseParameters: {
            'method.response.header.Access-Control-Allow-Headers': true,
            'method.response.header.Access-Control-Allow-Origin': true,
            'method.response.header.Access-Control-Allow-Methods': true
          }
        }
      ],
      apiKeyRequired: true
    })
  }

  // private addSendMessageMethod(
  //   resource: apigateway.Resource,
  //   env: string
  // ): void {
  //   const func = new lambda.Function(this, 'SendMessageFunction', {
  //     runtime: lambda.Runtime.NODEJS_12_X,
  //     handler: 'send-message.handler',
  //     code: lambda.Code.fromAsset('src/lambda')
  //   })
  //   const integration = new apigateway.LambdaIntegration(
  //     func,
  //     this.getLambdaIntegrationOptions(env)
  //   )
  //   const addedResource = resource.addResource('send-message')
  //   addedResource.addMethod('POST', integration, this.getMethodOptions(env))
  // }

  // private getLambdaIntegrationOptions(
  //   env: string
  // ): apigateway.LambdaIntegrationOptions {
  //   return env === 'dev'
  //     ? {
  //         integrationResponses: [
  //           {
  //             statusCode: '200',
  //             responseParameters: {
  //               'method.response.header.Access-Control-Allow-Origin': "'*'"
  //             }
  //           }
  //         ]
  //       }
  //     : {}
  // }
  //
  // private getMethodOptions(env: string): apigateway.MethodOptions {
  //   return env === 'dev'
  //     ? {
  //         apiKeyRequired: true,
  //         methodResponses: [
  //           {
  //             statusCode: '200',
  //             responseParameters: {
  //               'method.response.header.Access-Control-Allow-Origin': true
  //             }
  //           }
  //         ]
  //       }
  //     : { apiKeyRequired: true }
  // }
}
