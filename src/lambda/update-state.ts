import { IotData, Iot } from 'aws-sdk'

export type UpdateStateRequest = {
  thingName: string
  state: object
}

class UpdateState {
  public static async handler(request: UpdateStateRequest): Promise<object> {
    const { thingName, state } = request
    await UpdateState.validateThingName(thingName)
    await UpdateState.publishUpdateState(thingName, state)
    return state
  }

  static async validateThingName(thingName: string): Promise<void> {
    try {
      const iot = new Iot({ apiVersion: '2015-05-28' })
      await iot.describeThing({ thingName }).promise()
    } catch (e) {
      if (e.name === 'ResourceNotFoundException') {
        throw new Error('Thing Not Found')
      } else {
        throw e
      }
    }
  }

  static async publishUpdateState(
    thingName: string,
    state: object
  ): Promise<void> {
    const iotData = new IotData({
      apiVersion: '2015-05-28',
      region: process.env.region,
      endpoint: process.env.endpoint
    })
    const params = {
      thingName,
      payload: JSON.stringify({ state: { desired: state } })
    }
    await iotData.updateThingShadow(params).promise()
  }
}

export const handler = UpdateState.handler
