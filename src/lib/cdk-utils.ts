import * as cdk from '@aws-cdk/core'

export class CdkUtils {
  public static getContext(scope: cdk.Construct, key: string): string {
    const value = scope.node.tryGetContext(key)
    if (!value) {
      throw new Error(`Context "${key}" was not defined.`)
    }
    return value
  }

  public static getEnv(scope: cdk.Construct): string {
    return CdkUtils.getContext(scope, 'env')
  }

  public static makeId(scope: cdk.Construct, prefix: string): string {
    return `${prefix}-${CdkUtils.getEnv(scope)}`
  }
}
