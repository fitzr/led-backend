import * as cdk from '@aws-cdk/core'
import { LedBackendApi } from './led-backend-api'
import { helper } from './stack-helper'
import { LedBackendLambda } from './led-backend-lambda'

export class LedBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const lambda = new LedBackendLambda(this, helper.makeId('LedBackendLambda'))
    new LedBackendApi(this, helper.makeId('LedBackendApi'), lambda)
  }
}
