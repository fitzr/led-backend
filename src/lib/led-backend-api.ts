import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as apigw from '@aws-cdk/aws-apigateway'
import { helper } from './stack-helper'
import { LedBackendLambda } from './led-backend-lambda'
import { updateStateModel } from '../model/update-state'

export class LedBackendApi extends cdk.Construct {
  static readonly API_VERSION = 'v1'

  constructor(scope: cdk.Construct, id: string, lambda: LedBackendLambda) {
    super(scope, id)
    const api = this.createApi()
    this.createGatewayResponses(api)
    const resource = api.root
      .addResource(LedBackendApi.API_VERSION)
      .addResource('leds')
      .addResource('{thing_name}')
      .addResource('state', {
        defaultCorsPreflightOptions: helper.isDev
          ? {
              allowOrigins: apigw.Cors.ALL_ORIGINS,
              allowMethods: ['GET', 'PUT', 'OPTIONS'],
              allowHeaders: ['Content-Type', 'X-Api-Key']
            }
          : undefined
      })
    this.addGetConnectionMethod(resource, lambda.getStateFunction)
    this.addUpdateStateMethod(api, resource, lambda.updateStateFunction)
  }

  private createApi(): apigw.RestApi {
    const props: apigw.RestApiProps = {
      restApiName: helper.makeId('led-backend-api'),
      description: 'APIs for LED app.',
      deployOptions: {
        stageName: helper.env,
        metricsEnabled: true,
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

  private createGatewayResponses(api: apigw.RestApi): void {
    if (!helper.isDev) {
      return
    }
    new apigw.CfnGatewayResponse(this, 'GatewayResponseInvalidApiKey', {
      responseType: 'INVALID_API_KEY',
      restApiId: api.restApiId,
      responseParameters: {
        'gatewayresponse.header.Access-Control-Allow-Methods':
          "'OPTIONS,GET,PUT'",
        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'"
      }
    })
    new apigw.CfnGatewayResponse(this, 'GatewayResponseBadRequestBody', {
      responseType: 'BAD_REQUEST_BODY',
      restApiId: api.restApiId,
      responseParameters: {
        'gatewayresponse.header.Access-Control-Allow-Methods':
          "'OPTIONS,GET,PUT'",
        'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
        'gatewayresponse.header.Access-Control-Allow-Origin': "'*'"
      }
    })
  }

  private addGetConnectionMethod(
    resource: apigw.Resource,
    func: lambda.Function
  ): void {
    const successStatusCode = '200'
    const requestTemplate = '{"thingName":"$input.params(\'thing_name\')"}'
    resource.addMethod(
      'GET',
      new apigw.LambdaIntegration(
        func,
        this.integrationOptions(successStatusCode, requestTemplate)
      ),
      this.methodOptions(successStatusCode)
    )
  }

  private addUpdateStateMethod(
    api: apigw.RestApi,
    resource: apigw.Resource,
    func: lambda.Function
  ): void {
    // request body validation
    const requestValidator = api.addRequestValidator('UpdateStateValidator', {
      requestValidatorName: 'body-only',
      validateRequestBody: true
    })
    const requestModels = {
      'application/json': new apigw.Model(
        this,
        `UpdateStateModel${LedBackendApi.API_VERSION}`,
        {
          restApi: api,
          schema: updateStateModel
        }
      )
    }

    // request mapping
    const requestTemplate =
      '{"state": $input.json("$"),"thingName":"$input.params(\'thing_name\')"}'

    const successStatusCode = '202' // Accepted
    resource.addMethod(
      'PUT',
      new apigw.LambdaIntegration(
        func,
        this.integrationOptions(successStatusCode, requestTemplate)
      ),
      this.methodOptions(successStatusCode, requestValidator, requestModels)
    )
  }

  private integrationOptions(
    successStatusCode: string,
    requestTemplate: string
  ): apigw.LambdaIntegrationOptions {
    const responseParameters = helper.isDev
      ? {
          'method.response.header.Access-Control-Allow-Headers':
            "'Content-Type,X-Api-Key'",
          'method.response.header.Access-Control-Allow-Origin': "'*'",
          'method.response.header.Access-Control-Allow-Methods':
            "'OPTIONS,GET,PUT'"
        }
      : undefined
    return {
      passthroughBehavior: apigw.PassthroughBehavior.NEVER,
      proxy: false,
      integrationResponses: [
        {
          statusCode: successStatusCode,
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
              message: 'Requested thing was not found'
            })
          },
          responseParameters
        },
        {
          selectionPattern: '(\n|.)+',
          statusCode: '500',
          responseTemplates: {
            'application/json': JSON.stringify({
              message: 'Internal server error'
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

  private methodOptions(
    successStatusCode: string,
    requestValidator?: apigw.RequestValidator,
    requestModels?: { [param: string]: apigw.IModel }
  ): apigw.MethodOptions {
    const responseParameters = helper.isDev
      ? {
          'method.response.header.Access-Control-Allow-Headers': true,
          'method.response.header.Access-Control-Allow-Origin': true,
          'method.response.header.Access-Control-Allow-Methods': true
        }
      : undefined
    return {
      apiKeyRequired: true,
      requestValidator,
      requestModels,
      methodResponses: [
        {
          statusCode: successStatusCode,
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
