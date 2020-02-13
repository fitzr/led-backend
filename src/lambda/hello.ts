import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda'

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const result = {
    status: 200,
    message: 'Hello!!'
  }

  console.log('Hello Lambda.')
  console.log(context)

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
}
