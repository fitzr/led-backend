import { handler } from '../../src/lambda/hello'
import { APIGatewayEvent, Context } from 'aws-lambda'

test('hello', async () => {
  const actual = await handler({} as APIGatewayEvent, {} as Context)
  const expected = {
    statusCode: 200,
    body: '{"status":200,"message":"Hello!!"}'
  }
  expect(actual).toEqual(expected)
})
