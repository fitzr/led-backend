import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
import { CdkUtils } from './cdk-utils'

export class LedBackendApi extends cdk.Construct {
  static readonly API_VERSION = 'v1'

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)
    const env = CdkUtils.getEnv(scope)
    const api = this.createApi(env)
    const resource = api.root.addResource(LedBackendApi.API_VERSION)
    this.addGetStatusMethod(resource, env)
    this.addSendMessageMethod(resource, env)
  }

  private createApi(env: string): apigw.RestApi {
    let props: apigw.RestApiProps = {
      restApiName: `led-backend-api-${env}`,
      description: 'APIs for LED app.',
      deployOptions: {
        stageName: env
      }
    }
    if (env === 'dev') {
      // allow cors
      props = {
        ...props,
        defaultCorsPreflightOptions: {
          allowOrigins: apigw.Cors.ALL_ORIGINS,
          allowMethods: apigw.Cors.ALL_METHODS,
          statusCode: 200
        }
      }
    }
    const api = new apigw.RestApi(this, 'RestApi', props)
    const key = api.addApiKey('ApiKey')
    const plan = api.addUsagePlan('UsagePlan', {
      name: 'no-throttle',
      apiKey: key
    })
    plan.addApiStage({ stage: api.deploymentStage })
    return api
  }

  private addGetStatusMethod(resource: apigw.Resource, env: string): void {
    const func = new lambda.Function(this, 'GetStatusFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'get-status.handler',
      code: lambda.Code.fromAsset('src/lambda')
    })
    resource
      .addResource('status')
      .addMethod(
        'GET',
        new apigw.LambdaIntegration(func, this.integrationOptions(env)),
        this.methodOptions(env)
      )
  }

  private addSendMessageMethod(resource: apigw.Resource, env: string): void {
    const func = new lambda.Function(this, 'SendMessageFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'send-message.handler',
      code: lambda.Code.fromAsset('src/lambda')
    })
    resource
      .addResource('message')
      .addMethod(
        'POST',
        new apigw.LambdaIntegration(func, this.integrationOptions(env)),
        this.methodOptions(env)
      )
  }

  private integrationOptions(env: string): apigw.LambdaIntegrationOptions {
    let options: apigw.LambdaIntegrationOptions = {
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      proxy: false,
      integrationResponses: [
        {
          statusCode: '200'
        }
      ],
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    }
    if (env === 'dev') {
      // allow cors
      options = {
        ...options,
        integrationResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers':
                "'Content-Type,X-Api-Key'",
              'method.response.header.Access-Control-Allow-Origin': "'*'",
              'method.response.header.Access-Control-Allow-Methods':
                "'OPTIONS,GET,POST'"
            }
          }
        ]
      }
    }
    return options
  }

  private methodOptions(env: string): apigw.MethodOptions {
    let options: apigw.MethodOptions = {
      apiKeyRequired: true,
      methodResponses: [
        {
          statusCode: '200'
        }
      ]
    }
    if (env === 'dev') {
      // allow cors
      options = {
        ...options,
        methodResponses: [
          {
            statusCode: '200',
            responseParameters: {
              'method.response.header.Access-Control-Allow-Headers': true,
              'method.response.header.Access-Control-Allow-Origin': true,
              'method.response.header.Access-Control-Allow-Methods': true
            }
          }
        ]
      }
    }
    return options
  }
}
