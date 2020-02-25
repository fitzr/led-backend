#!/bin/bash

END_POINT=`aws iot describe-endpoint --output text`
mosquitto_sub --cafile root.crt \
              --cert deviceCertAndCACert.crt \
              --key deviceCert.key \
              -h $END_POINT \
              -p 8883 \
              -q 1 \
              -i FITZR0001 \
              --tls-version tlsv1.2 \
              -t '$aws/things/FITZR0001/shadow/update/delta' \
              -d
