import core = require('@aws-cdk/core')
import apigateway = require('@aws-cdk/aws-apigateway')
import lambda = require('@aws-cdk/aws-lambda')
import path = require('path')

export default class HelloService extends core.Construct {
  constructor(scope: core.Construct, id: string) {
    super(scope, id)

    const handler = new lambda.Function(this, 'hello-lambda', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'Hello.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda'))
    })

    const api = new apigateway.RestApi(this, 'hello-api', {
      restApiName: 'Hello Service',
      description: 'Test Gateway'
    })

    const getHelloIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { 'application/json': '{"statusCode":200}' }
    })

    api.root.addMethod('GET', getHelloIntegration)
  }
}
