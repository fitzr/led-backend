#!/bin/bash
END_POINT=$(<.tmp/endpoint.txt)
mosquitto_pub --cafile .tmp/test-root-CA.crt \
              --cert .tmp/test-thing-certificate.pem.crt \
              --key .tmp/test-thing-private.pem.key \
              -h $END_POINT \
              -p 8883 \
              -q 1 \
              -t '$aws/things/TestThing/shadow/update' \
              -m '{"state":{"reported":{"connection":"active"}}}' \
              -d
