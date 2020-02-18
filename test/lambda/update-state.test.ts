import { Iot, IotData } from 'aws-sdk'
import { UpdateStateRequest } from '../../src/lambda/update-state'

describe('UpdateState', () => {
  const mockDescribeThing = jest.fn()
  const mockUpdateThingShadow = jest.fn()
  let handler: (arg: UpdateStateRequest) => object

  beforeAll(() => {
    jest.mock('aws-sdk', () => ({
      Iot: jest.fn(() => ({
        describeThing: mockDescribeThing
      })),
      IotData: jest.fn(() => ({
        updateThingShadow: mockUpdateThingShadow
      }))
    }))
    // eslint-disable-next @typescript-eslint/no-var-requires
    handler = require('../../src/lambda/update-state').handler
  })

  beforeEach(() => {
    mockDescribeThing.mockClear()
    mockUpdateThingShadow.mockClear()
  })

  test('updates thing shadow', async () => {
    const payload = {
      state: {
        desired: { power: 'on' }
      }
    }
    mockDescribeThing.mockImplementation((params: Iot.DescribeThingRequest) => {
      expect(params).toEqual({ thingName: 'testThing' })
      return {
        promise: async (): Promise<Iot.DescribeThingResponse> => ({
          thingName: 'testThing'
        })
      }
    })
    mockUpdateThingShadow.mockImplementation(
      (params: IotData.UpdateThingShadowRequest) => {
        expect(params).toEqual({
          thingName: 'testThing',
          payload: JSON.stringify(payload)
        })
        return {
          promise: async (): Promise<IotData.UpdateThingShadowResponse> => ({
            payload: JSON.stringify(payload)
          })
        }
      }
    )
    const response = await handler({
      thingName: 'testThing',
      state: { power: 'on' }
    })
    expect(response).toEqual({ power: 'on' })
  })

  test('should returns not found error when thing name is not found', async () => {
    mockDescribeThing.mockImplementation(() => ({
      promise: async (): Promise<Iot.DescribeThingResponse> => {
        const ex = new Error("No shadow exists with name: 'nothing'")
        ex.name = 'ResourceNotFoundException'
        throw ex
      }
    }))
    await expect(
      handler({ thingName: 'nothing', state: { power: 'on' } })
    ).rejects.toEqual(new Error('Thing Not Found'))
  })

  test('should returns error when unexpected error is occurred', async () => {
    mockDescribeThing.mockImplementation(() => ({
      promise: async (): Promise<Iot.DescribeThingResponse> => {
        throw new Error('SOME ERROR')
      }
    }))
    await expect(
      handler({ thingName: 'testThing', state: { power: 'on' } })
    ).rejects.toEqual(new Error('SOME ERROR'))
  })
})
