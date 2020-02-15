// TODO add test for stack-helper
// import * as cdk from '@aws-cdk/core'
// import { CdkUtils } from '../../src/lib/cdk-utils'
//
// describe('CdkUtils', () => {
//   describe('getContext', () => {
//     test('can get context value', () => {
//       const app = new cdk.App({ context: { someKey: 'someValue' } })
//       const actual = CdkUtils.getContext(app, 'someKey')
//       expect(actual).toBe('someValue')
//     })
//
//     test('should throw error when context was not defined', () => {
//       const app = new cdk.App({ context: { someKey: 'someValue' } })
//       const t = (): string => CdkUtils.getContext(app, 'wrongKey')
//       expect(t).toThrowError('Context "wrongKey" was not defined.')
//     })
//   })
//
//   describe('getEnv', () => {
//     test('can get env', () => {
//       const app = new cdk.App({ context: { env: 'test' } })
//       const actual = CdkUtils.getEnv(app)
//       expect(actual).toBe('test')
//     })
//   })
//
//   describe('makeId', () => {
//     test('makes id with env', () => {
//       const app = new cdk.App({ context: { env: 'test' } })
//       const id = CdkUtils.makeId(app, 'id-prefix')
//       expect(id).toBe('id-prefix-test')
//     })
//   })
// })
