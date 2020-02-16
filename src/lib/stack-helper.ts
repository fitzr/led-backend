import * as cdk from '@aws-cdk/core'
import * as aws from 'aws-sdk'

class StackHelper {
  public readonly env: string
  public readonly region: string
  public readonly iotEndpoint: string

  constructor(env: string, region: string, iotEndpoint: string) {
    this.env = env
    this.region = region
    this.iotEndpoint = iotEndpoint
  }

  public makeId(prefix: string): string {
    return `${prefix}-${this.env}`
  }

  public get isDev(): boolean {
    return this.env === 'dev'
  }
}

const getContext = (scope: cdk.Construct, key: string): string => {
  const value = scope.node.tryGetContext(key)
  if (!value) {
    throw new Error(`Context "${key}" was not defined.`)
  }
  return value
}

// Helper instance.
export let helper: StackHelper = {} as any // eslint-disable-line  @typescript-eslint/no-explicit-any

// This method must be called once before using helper instance.
export const initialize = async (scope: cdk.Construct): Promise<void> => {
  const env = getContext(scope, 'env')
  const region = getContext(scope, 'region')

  const iot = new aws.Iot({ region })
  const res = await iot.describeEndpoint({ endpointType: 'iot:Data' }).promise()
  if (!res || !res.endpointAddress) {
    throw new Error(`Could not describe Iot endpoint.`)
  }

  helper = new StackHelper(env, region, res.endpointAddress as string)
}

// For test use only.
export const initializeForTest = (): void => {
  helper = new StackHelper('test', 'ap-northeast-1', 'example.com')
}
