import * as cdk from '@aws-cdk/core'
import { Iot } from 'aws-sdk'

describe('initialize', () => {
  test('gets iot endpoint', async () => {
    jest.mock('aws-sdk', () => ({
      Iot: jest.fn(() => ({
        describeEndpoint: jest.fn().mockImplementation(() => ({
          promise: async (): Promise<Iot.DescribeEndpointResponse> => ({
            endpointAddress: 'example.com'
          })
        }))
      }))
    }))
    // eslint-disable-next @typescript-eslint/no-var-requires
    const initialize = require('../../src/lib/stack-helper').initialize
    const app = new cdk.App({
      context: { env: 'test', region: 'ap-northeast-1' }
    })
    await initialize(app)
    // eslint-disable-next @typescript-eslint/no-var-requires
    const helper = require('../../src/lib/stack-helper').helper
    expect(helper.iotEndpoint).toBe('example.com')
  })
})

describe('getContext', () => {
  test('gets context value', () => {
    // eslint-disable-next @typescript-eslint/no-var-requires
    const getContext = require('../../src/lib/stack-helper').getContext
    const app = new cdk.App({ context: { someKey: 'someValue' } })
    const actual = getContext(app, 'someKey')
    expect(actual).toBe('someValue')
  })

  test('should throw error when context was not defined', () => {
    // eslint-disable-next @typescript-eslint/no-var-requires
    const getContext = require('../../src/lib/stack-helper').getContext
    const app = new cdk.App({ context: { someKey: 'someValue' } })
    const t = (): string => getContext(app, 'wrongKey')
    expect(t).toThrowError('Context "wrongKey" was not defined.')
  })
})
