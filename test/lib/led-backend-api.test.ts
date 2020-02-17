import * as cdk from '@aws-cdk/core'
import { expect, haveResource, ResourcePart } from '@aws-cdk/assert'
import { LedBackendApi } from '../../src/lib/led-backend-api'
import { LedBackendLambda } from '../../src/lib/led-backend-lambda'
import { initializeForTest } from '../../src/lib/stack-helper'

describe('LedBackendApi', () => {
  beforeAll(() => {
    initializeForTest()
  })

  test('has an ApiKey', () => {
    const stack = new cdk.Stack(
      new cdk.App({ context: { env: 'test' } }),
      'test-stack'
    )
    new LedBackendApi(
      stack,
      'TestApi',
      new LedBackendLambda(stack, 'TestLambda')
    )
    expect(stack).to(
      haveResource(
        'AWS::ApiGateway::ApiKey',
        undefined,
        ResourcePart.CompleteDefinition
      )
    )
  })
})
