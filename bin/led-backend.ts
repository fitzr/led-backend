#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from '@aws-cdk/core'
import LEDBackendStack from '../src/lib/LEDBackendStack'
import CDKUtils from '../src/lib/CDKUtils'

const app = new cdk.App()
new LEDBackendStack(app, CDKUtils.makeId(app, 'LEDBackendStack'))
