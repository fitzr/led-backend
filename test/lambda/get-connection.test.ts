import { IotData } from 'aws-sdk'

const getCurrentTimeStamp = (): number => (Date.now() / 1000) | 0

describe('GetConnection', () => {
  const mockFn = jest.fn()
  let handler: (arg: { thingName: string }) => object

  beforeAll(() => {
    jest.mock('aws-sdk', () => ({
      IotData: jest.fn(() => ({
        getThingShadow: mockFn
      }))
    }))
    // eslint-disable-next @typescript-eslint/no-var-requires
    handler = require('../../src/lambda/get-connection').handler
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
        reported: { connection: 'active' }
      },
      metadata: {
        reported: {
          connection: { timestamp: getCurrentTimeStamp() - 115 } // less than threshold 120 (2 minutes)
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
    expect(response).toEqual({ connection: 'active' })
  })

  test('should return inactive when shadow is initial value', async () => {
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
    expect(response).toEqual({ connection: 'inactive' })
  })

  test('should return inactive when timestamp is before than threshold', async () => {
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
    mockFn.mockImplementation(() => ({
      promise: async (): Promise<IotData.GetThingShadowResponse> => ({
        payload: JSON.stringify(payload)
      })
    }))
    const response = await handler({ thingName: 'testThing' })
    expect(response).toEqual({ connection: 'inactive' })
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