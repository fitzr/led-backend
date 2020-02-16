import { APIGatewayProxyResult } from 'aws-lambda'
import { IotData } from 'aws-sdk'

interface SendMessageRequest {
  thingName: string
  message: string
}

class SendMessage {
  public static async handler(
    request: SendMessageRequest
  ): Promise<APIGatewayProxyResult> {
    // TODO validate thing name and payload
    const iotData = new IotData({
      apiVersion: '2015-05-28',
      region: process.env.region,
      endpoint: process.env.endpoint
    })
    const params = {
      topic: `led/${request.thingName}/message`,
      payload: JSON.stringify(request.message),
      qos: 0
    }
    const result = await iotData.publish(params).promise()
    // TODO check result content
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  }
}

export const handler = SendMessage.handler
