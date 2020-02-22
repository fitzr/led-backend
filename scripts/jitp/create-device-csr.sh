#!/bin/bash

DCSJ="/C=JP/ST=Hokkaido/L=Sapporo/O=fitzr/OU=device/CN=HogeThing"

openssl genrsa -out deviceCert.key 2048
openssl req -new -key deviceCert.key -out deviceCert.csr -subj "$DCSJ"
openssl x509 -req -in deviceCert.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out deviceCert.crt -days 365 -sha256

cat deviceCert.crt rootCA.pem > deviceCertAndCACert.crt
