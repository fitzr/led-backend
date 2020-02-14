import * as cdk from '@aws-cdk/core'
import { expect, haveResource, ResourcePart } from '@aws-cdk/assert'
import LEDBackendApi from '../../src/lib/LEDBackendApi'

describe('LEDBackendApi', () => {
  test('has an ApiKey', () => {
    const stack = new cdk.Stack(
      new cdk.App({ context: { env: 'test' } }),
      'test-stack'
    )
    new LEDBackendApi(stack, 'TestApi')
    expect(stack).to(
      haveResource(
        'AWS::ApiGateway::ApiKey',
        undefined,
        ResourcePart.CompleteDefinition
      )
    )
  })
})
