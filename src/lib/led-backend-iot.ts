import * as cdk from '@aws-cdk/core'
import * as iot from '@aws-cdk/aws-iot'
import * as iam from '@aws-cdk/aws-iam'
import { helper } from './stack-helper'

export class LedBackendIot extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string) {
    super(scope, id)
    this.createPolicy()
  }

  private createPolicy(): void {
    const account = cdk.Stack.of(this).account
    const policyDocument = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['iot:Connect'],
          resources: [
            `arn:aws:iot:${helper.region}:${account}:client/\${iot:Connection.Thing.ThingName}`
          ]
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['iot:Publish', 'iot:Receive'],
          resources: [
            `arn:aws:iot:${helper.region}:${account}:topic/$aws/things/\${iot:Connection.Thing.ThingName}/shadow/*`
          ]
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['iot:Subscribe'],
          resources: [
            `arn:aws:iot:${helper.region}:${account}:topicfilter/$aws/things/\${iot:Connection.Thing.ThingName}/shadow/*`
          ]
        })
      ]
    })

    new iot.CfnPolicy(this, 'IotPolicy', {
      policyName: 'PubSubShadowPolicy',
      policyDocument
    })
  }
}
