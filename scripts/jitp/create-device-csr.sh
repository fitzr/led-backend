#!/bin/bash

THING_NAME="FITZR0001"
DCSJ="/C=JP/ST=Hokkaido/L=Sapporo/O=fitzr/OU=device/CN=$THING_NAME"

openssl genrsa -out deviceCert.key 2048
openssl req -new -key deviceCert.key -out deviceCert.csr -subj "$DCSJ"
openssl x509 -req -in deviceCert.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out deviceCert.crt -days 10950 -sha256

cat deviceCert.crt rootCA.pem > deviceCertAndCACert.crt
