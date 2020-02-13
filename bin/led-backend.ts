#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { LedBackendStack } from '../lib/led-backend-stack';

const app = new cdk.App();
new LedBackendStack(app, 'LedBackendStack');
