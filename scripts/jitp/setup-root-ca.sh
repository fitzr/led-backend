#!/bin/bash

# register CA certificate

CODE=`aws iot get-registration-code --output text`

CASJ="/C=JP/ST=Hokkaido/L=Sapporo/O=fitzr/OU=root/CN=ROOTCA"
VCSJ="/C=JP/ST=Hokkaido/L=Sapporo/O=fitzr/OU=verification/CN=${CODE}"

# generate root CA certificate
openssl genrsa -out rootCA.key 2048
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 10950 -out rootCA.pem -subj "$CASJ"

# generate verification certificate
openssl genrsa -out verificationCert.key 2048
openssl req -new -key verificationCert.key -out verificationCert.csr -subj "$VCSJ"
openssl x509 -req -in verificationCert.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out verificationCert.pem -days 10950 -sha256

# create Just In Time Provisioning policy
aws iam create-role --role-name JITP_Role --assume-role-policy-document file://JITPAssumeRolePolicyDocument.json
aws iam attach-role-policy --role-name JITP_Role --policy-arn arn:aws:iam::aws:policy/service-role/AWSIoTThingsRegistration
aws iam attach-role-policy --role-name JITP_Role --policy-arn arn:aws:iam::aws:policy/service-role/AWSIoTLogging
aws iam attach-role-policy --role-name JITP_Role --policy-arn arn:aws:iam::aws:policy/service-role/AWSIoTRuleActions

# register certificate
aws iot register-ca-certificate \
 --ca-certificate file://rootCA.pem \
 --verification-cert file://verificationCert.pem \
 --set-as-active \
 --allow-auto-registration \
 --registration-config file://provisioning-template.json
