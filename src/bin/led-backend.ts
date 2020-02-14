#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import { LedBackendStack } from '../lib/led-backend-stack'
import { CdkUtils } from '../lib/cdk-utils'

const app = new cdk.App()
new LedBackendStack(app, CdkUtils.makeId(app, 'LEDBackendStack'))
