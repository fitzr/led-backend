import * as cdk from '@aws-cdk/core'

export class CdkUtils {
  public static getEnv(scope: cdk.Construct): string {
    const env = scope.node.tryGetContext('env')
    if (!env) {
      throw new Error('Context "env" was not defined.')
    }
    return env
  }

  public static makeId(scope: cdk.Construct, prefix: string): string {
    return `${prefix}-${CdkUtils.getEnv(scope)}`
  }
}
