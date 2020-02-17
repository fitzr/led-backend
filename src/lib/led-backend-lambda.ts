import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as iam from '@aws-cdk/aws-iam'
import { helper } from './stack-helper'

export class LedBackendLambda extends cdk.Construct {
  public readonly getConnectionFunction: lambda.Function
  public readonly updateStateFunction: lambda.Function

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)
    this.getConnectionFunction = this.createGetConnectionFunction()
    this.updateStateFunction = this.createUpdateStateFunction()
  }

  private createGetConnectionFunction(): lambda.Function {
    const func = new lambda.Function(this, 'GetConnectionFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'get-connection.handler',
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

  private createUpdateStateFunction(): lambda.Function {
    const func = new lambda.Function(this, 'UpdateStateFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'update-state.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: {
        region: helper.region,
        endpoint: helper.iotEndpoint
      }
    })
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['iot:DescribeThing'],
        resources: [`arn:aws:iot:${helper.region}:*`]
      })
    )
    func.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ['iot:UpdateThingShadow'],
        resources: [`arn:aws:iot:${helper.region}:*`]
      })
    )
    return func
  }
}
