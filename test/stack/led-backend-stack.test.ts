import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert'
import * as cdk from '@aws-cdk/core'
import LedBackend = require('../../src/stack/led-backend-stack')

test('Empty Stack', () => {
  const app = new cdk.App()
  const stack = new LedBackend.LedBackendStack(app, 'MyTestStack')
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {}
      },
      MatchStyle.EXACT
    )
  )
})
