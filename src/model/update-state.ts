import {
  JsonSchema,
  JsonSchemaType,
  JsonSchemaVersion
} from '@aws-cdk/aws-apigateway'

export const updateStateModel: JsonSchema = {
  schema: JsonSchemaVersion.DRAFT7,
  description: 'Validation schema for update state API.',
  type: JsonSchemaType.OBJECT,
  properties: {
    power: {
      type: JsonSchemaType.STRING,
      pattern: '^(on|off)$'
    },
    brightness: {
      type: JsonSchemaType.NUMBER,
      minimum: 0,
      maximum: 100
    },
    color: {
      type: JsonSchemaType.STRING,
      minLength: 1,
      maxLength: 30
    }
  },
  additionalProperties: false
}
