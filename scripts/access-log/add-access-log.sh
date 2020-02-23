#!/bin/bash

ACCOUNT="xxxxxxxxxxxx"
API_ID="xxxxxxxxxxxx"
STAGE="dev"
LOG_GROUP="LedBackendApiAccessLogs"

aws logs create-log-group --log-group-name $LOG_GROUP

aws apigateway update-stage \
 --rest-api-id $API_ID \
 --stage-name $STAGE \
 --patch-operations op=add,path=/accessLogSettings/destinationArn,value=arn:aws:logs:ap-northeast-1:$ACCOUNT:log-group:$LOG_GROUP \
 --patch-operations 'op=add,path=/accessLogSettings/format,value="$context.identity.sourceIp,$context.identity.caller,$context.identity.user,$context.requestTime,$context.httpMethod,$context.resourcePath,$context.protocol,$context.status,$context.responseLength,$context.requestId"'

