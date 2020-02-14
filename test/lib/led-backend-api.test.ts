import * as cdk from '@aws-cdk/core'
import { expect, haveResource, ResourcePart } from '@aws-cdk/assert'
import { LedBackendApi } from '../../src/lib/led-backend-api'

describe('LedBackendApi', () => {
  test('has an ApiKey', () => {
    const stack = new cdk.Stack(
      new cdk.App({ context: { env: 'test' } }),
      'test-stack'
    )
    new LedBackendApi(stack, 'TestApi')
    expect(stack).to(
      haveResource(
        'AWS::ApiGateway::ApiKey',
        undefined,
        ResourcePart.CompleteDefinition
      )
    )
  })
})
