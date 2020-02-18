import { IotData } from 'aws-sdk'

export interface GetStateRequest {
  thingName: string
}

class GetState {
  public static async handler(request: GetStateRequest): Promise<object> {
    const iotData = new IotData({
      apiVersion: '2015-05-28',
      region: process.env.region,
      endpoint: process.env.endpoint
    })
    const params = {
      thingName: request.thingName
    }
    try {
      const result = await iotData.getThingShadow(params).promise()
      const payload = JSON.parse(result.payload as string)
      return GetState.isConnecting(payload)
        ? payload.state.reported
        : { connection: 'inactive' }
    } catch (e) {
      if (e.name === 'ResourceNotFoundException') {
        throw new Error('Thing Not Found')
      } else {
        throw e
      }
    }
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  static isConnecting(payload: any): boolean {
    const connection = payload?.state?.reported?.connection
    if (connection !== 'active') {
      return false
    }
    const timestamp = payload?.metadata?.reported?.connection?.timestamp
    return timestamp ? GetState.isValidTimestamp(timestamp) : false
  }

  static isValidTimestamp(timestamp: number): boolean {
    const thresholdTime: number = process.env.thresholdTime
      ? parseInt(process.env.thresholdTime, 10)
      : 2 * 60 // timestamp threshold default 2 minutes
    return timestamp + thresholdTime > GetState.getCurrentTime()
  }

  static getCurrentTime(): number {
    return (Date.now() / 1000) | 0
  }
}

export const handler = GetState.handler
