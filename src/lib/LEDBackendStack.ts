import core = require('@aws-cdk/core')
import HelloService from './HelloService'

export default class LEDBackendStack extends core.Stack {
  constructor(scope: core.Construct, id: string, props?: core.StackProps) {
    super(scope, id, props)

    new HelloService(this, 'HelloService')
  }
}
