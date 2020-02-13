import { handler } from '../../src/lambda/hello'
import { APIGatewayEvent, Context } from 'aws-lambda'

test('hello', async () => {
  const actual = await handler({} as APIGatewayEvent, {} as Context)
  const expected = {
    body: '{"status":200,"message":"Hello!!"}',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    statusCode: 200
  }
  expect(actual).toEqual(expected)
})
