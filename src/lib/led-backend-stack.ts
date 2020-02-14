import * as cdk from '@aws-cdk/core'
import { LedBackendApi } from './led-backend-api'
import { CdkUtils } from './cdk-utils'

export class LedBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new LedBackendApi(this, CdkUtils.makeId(scope, 'LEDBackendApi'))
  }
}
