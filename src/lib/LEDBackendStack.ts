import core = require('@aws-cdk/core')
import LEDBackendAPI from './LEDBackendApi'

export default class LEDBackendStack extends core.Stack {
  constructor(scope: core.Construct, id: string, props?: core.StackProps) {
    super(scope, id, props)

    new LEDBackendAPI(this, 'LEDBackendApi')
  }
}
