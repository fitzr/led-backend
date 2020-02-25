const fetch = require('node-fetch')

describe('put state api', () => {
  test('should return accepted', async () => {
    return fetch(`${API_ROOT}/leds/${THING_NAME}/state`, {
      method: 'PUT',
      body: JSON.stringify({
        power: 'on',
        color: 'white',
        brightness: 100
      }),
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json'
      },
    }).then(res => {
      expect(res.status).toBe(202)
      return res.json()
    }).then(json => {
      expect(json).toEqual({
        power: 'on',
        color: 'white',
        brightness: 100,
      })
    })
  })


  test('should return 400 when request has invalid param', async () => {
    return fetch(`${API_ROOT}/leds/${THING_NAME}/state`, {
      method: 'PUT',
      body: JSON.stringify({
        invalid: 'xxxxx'
      }),
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json'
      },
    }).then(res => {
      expect(res.status).toBe(400)
      return res.json()
    }).then(json => {
      expect(json).toEqual({ message: 'Invalid request body' })
    })
  })

  test('should return 400 when power value is not valid', async () => {
    return fetch(`${API_ROOT}/leds/${THING_NAME}/state`, {
      method: 'PUT',
      body: JSON.stringify({
        power: 'xxxxx' // must be on or off
      }),
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json'
      },
    }).then(res => {
      expect(res.status).toBe(400)
      return res.json()
    }).then(json => {
      expect(json).toEqual({ message: 'Invalid request body' })
    })
  })

  test('should return 400 when brightness value is not valid', async () => {
    return fetch(`${API_ROOT}/leds/${THING_NAME}/state`, {
      method: 'PUT',
      body: JSON.stringify({
        brightness: 101 // must be less or equal than 100
      }),
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json'
      },
    }).then(res => {
      expect(res.status).toBe(400)
      return res.json()
    }).then(json => {
      expect(json).toEqual({ message: 'Invalid request body' })
    })
  })

  test('should return 400 when color value is not valid', async () => {
    return fetch(`${API_ROOT}/leds/${THING_NAME}/state`, {
      method: 'PUT',
      body: JSON.stringify({
        color: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' // length must be less or equal than 30
      }),
      headers: {
        'x-api-key': API_KEY,
        'content-type': 'application/json'
      },
    }).then(res => {
      expect(res.status).toBe(400)
      return res.json()
    }).then(json => {
      expect(json).toEqual({ message: 'Invalid request body' })
    })
  })

  test('should return 404 when requested thing is not found', async () => {
    return fetch(`${API_ROOT}/leds/${ERROR_THING_NAME}/state`, {
      method: 'PUT',
      body: JSON.stringify({
        power: 'on'
      }),
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
      method: 'PUT',
      body: JSON.stringify({
        power: 'on'
      }),
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
