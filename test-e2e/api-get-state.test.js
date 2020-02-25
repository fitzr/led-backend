const fetch = require('node-fetch')

describe('get state api', () => {
  test('should get state', async () => {
    return fetch(`${API_ROOT}/leds/${THING_NAME}/state`, {
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json'
      },
    }).then(res => {
      expect(res.status).toBe(200)
      return res.json()
    }).then(json => {
      expect(json).toEqual(expect.objectContaining({
        connection: expect.stringMatching(/^(in)?active$/)
      }))
    })
  })

  test('should return 404 when requested thing is not found', async () => {
    return fetch(`${API_ROOT}/leds/${ERROR_THING_NAME}/state`, {
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json'
      },
    }).then(res => {
      expect(res.status).toBe(404)
      return res.json()
    }).then(json => {
      expect(json).toEqual({ message: 'Requested thing was not found' })
    })
  })

  test('should return 403 when requested key is not valid', () => {
    return fetch(`${API_ROOT}/leds/${ERROR_THING_NAME}/state`, {
      headers: {
        'x-api-key': 'INVALIE_API_KEY',
        'content-type': 'application/json'
      },
    }).then(res => {
      expect(res.status).toBe(403)
      return res.json()
    }).then(json => {
      expect(json).toEqual({ message: 'Forbidden' })
    })
  })
})
