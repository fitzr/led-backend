#!/bin/bash
END_POINT=$(<.tmp/endpoint.txt)
mosquitto_sub --cafile .tmp/test-root-CA.crt \
              --cert .tmp/test-thing-certificate.pem.crt \
              --key .tmp/test-thing-private.pem.key \
              -h $END_POINT \
              -i TestThing \
              -p 8883 \
              -q 1 \
              -t '$aws/things/TestThing/shadow/update/delta' \
              -d

