import { SynthUtils } from '@aws-cdk/assert'
import { Stack } from '@aws-cdk/core'
import { LedBackendLambda } from '../../src/lib/led-backend-lambda'

test('LedBackendLambda has no diff', () => {
  const stack = new Stack()
  new LedBackendLambda(stack, 'LBL')
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
})
