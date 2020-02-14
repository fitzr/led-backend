import { App, Stack } from '@aws-cdk/core'
import LEDBackendApi from '../../src/lib/LEDBackendApi'
import { expect, haveResource, ResourcePart } from '@aws-cdk/assert'

describe('LEDBackendApi', () => {
  test('has an ApiKey', () => {
    const stack = new Stack(new App({ context: { env: 'test' } }), 'test-stack')
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
