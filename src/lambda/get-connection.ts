import { IotData } from 'aws-sdk'

interface GetConnectionRequest {
  thingName: string
}

class GetConnection {
  public static async handler(request: GetConnectionRequest): Promise<object> {
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
        connection: GetConnection.isConnecting(result) ? 'active' : 'inactive'
      }
    } catch (e) {
      if (e.name === 'ResourceNotFoundException') {
        throw new Error('Thing Not Found')
      } else {
        throw e
      }
    }
  }

  static isConnecting(result: IotData.GetThingShadowResponse): boolean {
    const payload = JSON.parse((result.payload as string) || '{}')
    const connection = payload?.state?.reported?.connection
    if (connection !== 'active') {
      return false
    }
    const timestamp = payload?.metadata?.reported?.connection?.timestamp
    return timestamp ? GetConnection.isValidTimestamp(timestamp) : false
  }

  static isValidTimestamp(timestamp: number): boolean {
    const thresholdTime: number = process.env.thresholdTime
      ? parseInt(process.env.thresholdTime, 10)
      : 2 * 60 // timestamp threshold default 2 minutes
    return timestamp + thresholdTime > GetConnection.getCurrentTime()
  }

  static getCurrentTime(): number {
    return (Date.now() / 1000) | 0
  }
}

export const handler = GetConnection.handler
