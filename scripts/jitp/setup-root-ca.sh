#!/bin/bash

# register CA certificate

CODE=`aws iot get-registration-code --output text`

CASJ="/C=JP/ST=Hokkaido/L=Sapporo/O=fitzr/OU=root/CN=ROOTCA"
VCSJ="/C=JP/ST=Hokkaido/L=Sapporo/O=fitzr/OU=verification/CN=${CODE}"

openssl genrsa -out rootCA.key 2048
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem -subj "$CASJ"

openssl genrsa -out verificationCert.key 2048
openssl req -new -key verificationCert.key -out verificationCert.csr -subj "$VCSJ"
openssl x509 -req -in verificationCert.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out verificationCert.pem -days 500 -sha256

aws iot register-ca-certificate \
 --ca-certificate file://rootCA.pem \
 --verification-cert file://verificationCert.pem \
 --set-as-active \
 --allow-auto-registration \
 --registration-config file://provisioning-template.json
