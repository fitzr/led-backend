import { Construct } from '@aws-cdk/core'

export default class CDKUtils {
  public static getEnv(scope: Construct): string {
    const env = scope.node.tryGetContext('env')
    if (!env) {
      throw new Error('Context "env" was not defined.')
    }
    return env
  }

  public static makeId(scope: Construct, prefix: string): string {
    return `${prefix}-${CDKUtils.getEnv(scope)}`
  }
}
