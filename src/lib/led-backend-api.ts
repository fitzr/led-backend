import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
import { helper } from './stack-helper'
import { LedBackendLambda } from './led-backend-lambda'

export class LedBackendApi extends cdk.Construct {
  static readonly API_VERSION = 'v1'

  constructor(scope: cdk.Construct, id: string, lambda: LedBackendLambda) {
    super(scope, id)
    const api = this.createApi()
    const resource = api.root
      .addResource(LedBackendApi.API_VERSION)
      .addResource('leds')
      .addResource('{thing_name}')
    this.addGetStatusMethod(resource, lambda.getStatusFunction)
    this.addSendMessageMethod(resource, lambda.sendMessageFunction)
  }

  private createApi(): apigw.RestApi {
    let props: apigw.RestApiProps = {
      restApiName: helper.makeId('led-backend-api'),
      description: 'APIs for LED app.',
      deployOptions: {
        stageName: helper.env
      }
    }
    if (helper.isDev) {
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

  private addGetStatusMethod(
    resource: apigw.Resource,
    func: lambda.Function
  ): void {
    resource
      .addResource('status')
      .addMethod(
        'GET',
        new apigw.LambdaIntegration(func, this.integrationOptions()),
        this.methodOptions()
      )
  }

  private addSendMessageMethod(
    resource: apigw.Resource,
    func: lambda.Function
  ): void {
    resource
      .addResource('message')
      .addMethod(
        'POST',
        new apigw.LambdaIntegration(func, this.integrationOptions()),
        this.methodOptions()
      )
  }

  private integrationOptions(): apigw.LambdaIntegrationOptions {
    let options: apigw.LambdaIntegrationOptions = {
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      proxy: false,
      integrationResponses: [
        {
          statusCode: '200'
        }
      ],
      requestTemplates: {
        'application/json':
          '{"message": $input.json("$"),"thingName":"$input.params(\'thing_name\')"}'
      }
    }
    if (helper.isDev) {
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

  private methodOptions(): apigw.MethodOptions {
    let options: apigw.MethodOptions = {
      apiKeyRequired: true,
      methodResponses: [
        {
          statusCode: '200'
        }
      ]
    }
    if (helper.isDev) {
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
