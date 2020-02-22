#!/bin/bash
END_POINT=$(<.tmp/endpoint.txt)
mosquitto_pub --cafile root.crt \
              --cert deviceCertAndCACert.crt \
              --key deviceCert.key \
              -h $END_POINT \
              -p 8883 \
              -q 1 \
              -t 'foo/bar' \
              -I 'FOO_BAR' \
              --tls-version tlsv1.2 \
              -m "Hello" \
              -d

