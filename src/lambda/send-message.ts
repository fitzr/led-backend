import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

class SendMessage {
  public static async handler(
    event: APIGatewayEvent,
    context: Context
  ): Promise<APIGatewayProxyResult> {
    const result = {
      status: 200,
      message: 'Send Message!!'
    }

    console.log('SendMessage Lambda.')
    console.log(context)

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  }
}

export const handler = SendMessage.handler
