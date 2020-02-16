import { IotData } from 'aws-sdk'

interface GetStatusRequest {
  thingName: string
}

class GetStatus {
  public static async handler(request: GetStatusRequest): Promise<object> {
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
      return {
        power: GetStatus.isPowerOn(result) ? 'on' : 'off'
      }
    } catch (e) {
      if (e.name === 'ResourceNotFoundException') {
        throw new Error('Thing Not Found')
      } else {
        throw e
      }
    }
  }

  static isPowerOn(result: IotData.GetThingShadowResponse): boolean {
    const payload = JSON.parse((result.payload as string) || '{}')
    const power = payload?.state?.reported?.power
    if (power !== 'on') {
      return false
    }
    const timestamp = payload?.metadata?.reported?.power?.timestamp
    return timestamp ? GetStatus.isValidTimestamp(timestamp) : false
  }

  static isValidTimestamp(timestamp: number): boolean {
    const thresholdTime: number = process.env.thresholdTime
      ? parseInt(process.env.thresholdTime, 10)
      : 2 * 60 // timestamp threshold default 2 minutes
    return timestamp + thresholdTime > GetStatus.getCurrentTime()
  }

  static getCurrentTime(): number {
    return (Date.now() / 1000) | 0
  }
}

export const handler = GetStatus.handler
