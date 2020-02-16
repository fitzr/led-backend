import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as iam from '@aws-cdk/aws-iam'
import { helper } from './stack-helper'

export class LedBackendLambda extends cdk.Construct {
  public readonly getStatusFunction: lambda.Function
  public readonly sendMessageFunction: lambda.Function

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)
    this.getStatusFunction = this.createGetStatusFunction()
    this.sendMessageFunction = this.createSendMessageFunction()
  }

  private createGetStatusFunction(): lambda.Function {
    const func = new lambda.Function(this, 'GetStatusFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'get-status.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: {
        region: helper.region,
        endpoint: helper.iotEndpoint
      }
    })
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['iot:GetThingShadow'],
        resources: [`arn:aws:iot:${helper.region}:*`]
      })
    )
    return func
  }

  private createSendMessageFunction(): lambda.Function {
    const func = new lambda.Function(this, 'SendMessageFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'send-message.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: {
        region: helper.region,
        endpoint: helper.iotEndpoint
      }
    })
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['iot:Publish'],
        resources: [`arn:aws:iot:${helper.region}:*`]
      })
    )
    return func
  }
}
