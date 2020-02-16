import { IotData } from 'aws-sdk'

const getCurrentTimeStamp = (): number => (Date.now() / 1000) | 0

describe('GetStatus', () => {
  const mockFn = jest.fn()
  let handler: (arg: {
    thingName: string
  }) => { statusCode: number; body: string }

  beforeAll(() => {
    jest.mock('aws-sdk', () => ({
      IotData: jest.fn(() => ({
        getThingShadow: mockFn
      }))
    }))
    // eslint-disable-next @typescript-eslint/no-var-requires
    handler = require('../../src/lambda/get-status').handler
    process.env.region = 'ap-northeast-1'
    process.env.endpoint = 'example.com'
  })

  beforeEach(() => {
    mockFn.mockClear()
  })

  afterAll(() => {
    delete process.env.region
    delete process.env.endpoint
  })

  test('returns connecting status', async () => {
    const payload = {
      state: {
        reported: { power: 'on' }
      },
      metadata: {
        reported: {
          power: { timestamp: getCurrentTimeStamp() - 115 } // less than threshold 120 (2 minutes)
        }
      }
    }
    mockFn.mockImplementation(params => {
      expect(params).toEqual({ thingName: 'testThing' })
      return {
        promise: async (): Promise<IotData.GetThingShadowResponse> => ({
          payload: JSON.stringify(payload)
        })
      }
    })
    const response = await handler({ thingName: 'testThing' })
    expect(response).toEqual({ power: 'on' })
  })

  test('should return disconnected status when shadow is initial value', async () => {
    const payload = {
      metadata: {},
      timestamp: getCurrentTimeStamp(),
      version: 1
    }
    mockFn.mockImplementation(() => ({
      promise: async (): Promise<IotData.GetThingShadowResponse> => ({
        payload: JSON.stringify(payload)
      })
    }))
    const response = await handler({ thingName: 'testThing' })
    expect(response).toEqual({ power: 'off' })
  })

  test('should return disconnected status when timestamp is before than threshold', async () => {
    const payload = {
      state: {
        reported: { power: 'on' }
      },
      metadata: {
        reported: {
          power: { timestamp: getCurrentTimeStamp() - 125 } // greater than threshold 120 (2 minutes)
        }
      }
    }
    mockFn.mockImplementation(() => ({
      promise: async (): Promise<IotData.GetThingShadowResponse> => ({
        payload: JSON.stringify(payload)
      })
    }))
    const response = await handler({ thingName: 'testThing' })
    expect(response).toEqual({ power: 'off' })
  })

  test('should return not found error when the thing is not found', async () => {
    mockFn.mockImplementation(() => ({
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
    mockFn.mockImplementation(() => ({
      promise: async (): Promise<IotData.GetThingShadowResponse> => {
        throw new Error('SOME ERROR')
      }
    }))
    await expect(handler({ thingName: 'testThing' })).rejects.toEqual(
      new Error('SOME ERROR')
    )
  })
})
