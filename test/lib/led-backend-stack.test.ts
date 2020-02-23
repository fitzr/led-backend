import { SynthUtils } from '@aws-cdk/assert'
import { Stack } from '@aws-cdk/core'
import { LedBackendStack } from '../../src/lib/led-backend-stack'
import { initializeForTest } from '../../src/lib/stack-helper'

test('LedBackendStack has no diff', () => {
  initializeForTest()
  const stack = new Stack()
  new LedBackendStack(stack, 'LBS')
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
})
