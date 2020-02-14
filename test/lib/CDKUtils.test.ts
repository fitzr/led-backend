import * as cdk from '@aws-cdk/core'
import CDKUtils from '../../src/lib/CDKUtils'

describe('CDKUtils', () => {
  describe('getEnv', () => {
    test('can get env', () => {
      const app = new cdk.App({ context: { env: 'test' } })
      const env = CDKUtils.getEnv(app)
      expect(env).toBe('test')
    })

    test('should throw error when env was not defined', () => {
      const app = new cdk.App()
      const t = (): string => CDKUtils.getEnv(app)
      expect(t).toThrowError('Context "env" was not defined.')
    })
  })

  describe('makeId', () => {
    test('makes id with env', () => {
      const app = new cdk.App({ context: { env: 'test' } })
      const id = CDKUtils.makeId(app, 'id-prefix')
      expect(id).toBe('id-prefix-test')
    })
  })
})
