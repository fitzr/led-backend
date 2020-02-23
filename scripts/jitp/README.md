# Just In Time Provisioning

Register things with valid certificates automatically.

## Settings

1. Create [provisioning templates](./provisioning-template.json). (as referenced [here](https://docs.aws.amazon.com/iot/latest/developerguide/provision-template.html))
2. Create and register the CA certificate. (like [this](./setup-root-ca.sh))
3. Create a device certificate with thing name, as a common name, for each device. (like [this](./create-device-csr.sh))

## References

* [Just-in-Time Provisioning](https://docs.aws.amazon.com/iot/latest/developerguide/jit-provisioning.html)  
* [Setting Up Just-in-Time Provisioning with AWS IoT Core](https://aws.amazon.com/jp/blogs/iot/setting-up-just-in-time-provisioning-with-aws-iot-core/)  
* [AWS IoTの証明書自動登録でクライアント証明書の運用を楽にする](https://dev.classmethod.jp/cloud/aws/awsiot-cert-auto-regist/)
