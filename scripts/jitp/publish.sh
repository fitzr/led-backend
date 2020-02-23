#!/bin/bash

END_POINT=$(<.tmp/endpoint.txt)
mosquitto_pub --cafile root.crt \
              --cert deviceCertAndCACert.crt \
              --key deviceCert.key \
              -h $END_POINT \
              -p 8883 \
              -q 1 \
              -i FITZR0001 \
              --tls-version tlsv1.2 \
              -t '$aws/things/FITZR0001/shadow/update' \
              -m '{"state":{"reported":{"connection":"active"}}}' \
              -d

