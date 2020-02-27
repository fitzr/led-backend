import { IotData } from 'aws-sdk'
import { GetStateRequest } from '../../src/lambda/get-state'

const getCurrentTimeStamp = (): number => Math.floor(Date.now() / 1000)

describe('GetState', () => {
  const mockGetThingShadow = jest.fn()
  let handler: (arg: GetStateRequest) => object

  beforeAll(() => {
    jest.mock('aws-sdk', () => ({
      IotData: jest.fn(() => ({
        getThingShadow: mockGetThingShadow
      }))
    }))
    // eslint-disable-next @typescript-eslint/no-var-requires
    handler = require('../../src/lambda/get-state').handler
  })

  beforeEach(() => {
    mockGetThingShadow.mockClear()
  })

  test('returns status', async () => {
    const payload = {
      state: {
        reported: { connection: 'active', power: 'on', brightness: 50 }
      },
      metadata: {
        reported: {
          connection: { timestamp: getCurrentTimeStamp() - 115 } // less than threshold 120 (2 minutes)
        }
      }
    }
    mockGetThingShadow.mockImplementation(params => {
      expect(params).toEqual({ thingName: 'testThing' })
      return {
        promise: async (): Promise<IotData.GetThingShadowResponse> => ({
          payload: JSON.stringify(payload)
        })
      }
    })
    const response = await handler({ thingName: 'testThing' })
    expect(response).toEqual({
      connection: 'active',
      power: 'on',
      brightness: 50
    })
  })

  test('should return inactive connection when shadow is initial value', async () => {
    const payload = {
      metadata: {},
      timestamp: getCurrentTimeStamp(),
      version: 1
    }
    mockGetThingShadow.mockImplementation(() => ({
      promise: async (): Promise<IotData.GetThingShadowResponse> => ({
        payload: JSON.stringify(payload)
      })
    }))
    const response = await handler({ thingName: 'testThing' })
    expect(response).toEqual({ connection: 'inactive' })
  })

  test('should return inactive connection when timestamp is before than threshold', async () => {
    const payload = {
      state: {
        reported: { connection: 'active' }
      },
      metadata: {
        reported: {
          connection: { timestamp: getCurrentTimeStamp() - 125 } // greater than threshold 120 (2 minutes)
        }
      }
    }
    mockGetThingShadow.mockImplementation(() => ({
      promise: async (): Promise<IotData.GetThingShadowResponse> => ({
        payload: JSON.stringify(payload)
      })
    }))
    const response = await handler({ thingName: 'testThing' })
    expect(response).toEqual({ connection: 'inactive' })
  })

  test('should return not found error when the thing is not found', async () => {
    mockGetThingShadow.mockImplementation(() => ({
      promise: async (): Promise<IotData.GetThingShadowResponse> => {
        const ex = new Error("No shadow exists with name: 'nothing'")
        ex.name = 'ResourceNotFoundException'
        throw ex
      }
    }))
    await expect(handler({ thingName: 'nothing' })).rejects.toEqual(
      new Error('Thing Not Found')
    )
  })

  test('should return error when unexpected error is occurred', async () => {
    mockGetThingShadow.mockImplementation(() => ({
      promise: async (): Promise<IotData.GetThingShadowResponse> => {
        throw new Error('SOME ERROR')
      }
    }))
    await expect(handler({ thingName: 'testThing' })).rejects.toEqual(
      new Error('SOME ERROR')
    )
  })
})
