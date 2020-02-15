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
    const { region, endpoint } = process.env
    const iotData = new IotData({ endpoint, region })
    // TODO validate thing name and payload
    const params = {
      topic: `led/${request.thingName}/message`,
      payload: JSON.stringify(request.message),
      qos: 0
    }
    const result = await iotData.publish(params).promise()
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  }
}

export const handler = SendMessage.handler
