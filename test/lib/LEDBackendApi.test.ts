import { Stack } from '@aws-cdk/core'
import LEDBackendApi from '../../src/lib/LEDBackendApi'
import { expect, haveResource, ResourcePart } from '@aws-cdk/assert'

describe('LEDBackendApi', () => {
  test('has a ApiKey', () => {
    const stack = new Stack()
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
