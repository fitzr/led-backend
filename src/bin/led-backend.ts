#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { LedBackendStack } from '../lib/led-backend-stack'
import { initialize, helper } from '../lib/stack-helper'

const execute = async (): Promise<void> => {
  const app = new cdk.App()
  await initialize(app)
  new LedBackendStack(app, helper.makeId('LEDBackendStack'), {
    env: { region: helper.region }
  })
}

execute()
