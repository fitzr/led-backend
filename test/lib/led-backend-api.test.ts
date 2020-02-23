import { SynthUtils } from '@aws-cdk/assert'
import { LedBackendApi } from '../../src/lib/led-backend-api'
import { initializeForTest } from '../../src/lib/stack-helper'
import { Stack } from '@aws-cdk/core'
import { LedBackendLambda } from '../../src/lib/led-backend-lambda'

describe('LedBackendApi', () => {
  test('has no diff when env is not dev', () => {
    initializeForTest('test')
    const stack = new Stack()
    new LedBackendApi(stack, 'LBA', new LedBackendLambda(stack, 'TestLambda'))
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
  })

  test('has no diff when env is dev', () => {
    initializeForTest('dev')
    const stack = new Stack()
    new LedBackendApi(stack, 'LBA', new LedBackendLambda(stack, 'TestLambda'))
    expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
  })
})
