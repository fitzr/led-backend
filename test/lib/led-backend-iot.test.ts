import { SynthUtils } from '@aws-cdk/assert'
import { Stack } from '@aws-cdk/core'
import { LedBackendIot } from '../../src/lib/led-backend-iot'

test('LedBackendIot has no diff', () => {
  const stack = new Stack()
  new LedBackendIot(stack, 'LBI')
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot()
})
