import * as cdk from '@aws-cdk/core'
import LEDBackendAPI from './LEDBackendApi'
import CDKUtils from './CDKUtils'

export default class LEDBackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    new LEDBackendAPI(this, CDKUtils.makeId(scope, 'LEDBackendApi'))
  }
}
