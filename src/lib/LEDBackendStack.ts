import { Construct, Stack, StackProps } from '@aws-cdk/core'
import LEDBackendAPI from './LEDBackendApi'
import CDKUtils from './CDKUtils'

export default class LEDBackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    new LEDBackendAPI(this, CDKUtils.makeId(scope, 'LEDBackendApi'))
  }
}
