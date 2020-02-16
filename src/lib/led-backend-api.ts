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
    const requestTemplate = '{"thingName":"$input.params(\'thing_name\')"}'
    resource
      .addResource('status')
      .addMethod(
        'GET',
        new apigw.LambdaIntegration(
          func,
          this.integrationOptions(requestTemplate)
        ),
        this.methodOptions()
      )
  }

  private addSendMessageMethod(
    resource: apigw.Resource,
    func: lambda.Function
  ): void {
    const requestTemplate =
      '{"message": $input.json("$"),"thingName":"$input.params(\'thing_name\')"}'
    resource
      .addResource('message')
      .addMethod(
        'POST',
        new apigw.LambdaIntegration(
          func,
          this.integrationOptions(requestTemplate)
        ),
        this.methodOptions()
      )
  }

  private integrationOptions(
    requestTemplate: string
  ): apigw.LambdaIntegrationOptions {
    const responseParameters = helper.isDev
      ? {
          'method.response.header.Access-Control-Allow-Headers':
            "'Content-Type,X-Api-Key'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
          'method.response.header.Access-Control-Allow-Methods':
            "'OPTIONS,GET,POST'"
        }
      : undefined
    return {
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      proxy: false,
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            'application/json': '$input.json("$")'
          },
          responseParameters
        },
        {
          selectionPattern: 'Thing Not Found',
          statusCode: '404',
          responseTemplates: {
            'application/json': JSON.stringify({
              error: { message: 'Requested thing was not found.' }
            })
          },
          responseParameters
        },
        {
          selectionPattern: '(\n|.)+',
          statusCode: '500',
          responseTemplates: {
            'application/json': JSON.stringify({
              error: { message: 'Internal server error.' }
            })
          },
          responseParameters
        }
      ],
      requestTemplates: {
        'application/json': requestTemplate
      }
    }
  }

  private methodOptions(): apigw.MethodOptions {
    const responseParameters = helper.isDev
      ? {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true
        }
      : undefined
    return {
      apiKeyRequired: true,
      methodResponses: [
        {
          statusCode: '200',
          responseParameters
        },
        {
          statusCode: '404',
          responseParameters
        },
        {
          statusCode: '500',
          responseParameters
        }
      ]
    }
  }
}
