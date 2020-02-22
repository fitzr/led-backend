import paho.mqtt.client as mqtt

CLIENT_ID = 'TestThing'
CA = '.tmp/test-root-CA.crt'
CERT = '.tmp/test-thing-certificate.pem.crt'
PRIVATE = '.tmp/test-thing-private.pem.key'
PORT = 8883


def endpoint():
    with open('.tmp/endpoint.txt', 'r') as f:
        return f.read().splitlines()[0]


class Mqtt:
    def __init__(self):
        self.__client = mqtt.Client(client_id=CLIENT_ID)
        self.__client.tls_set(ca_certs=CA, certfile=CERT, keyfile=PRIVATE)

    def connect(self):
        self.__client.connect(endpoint(), PORT)
        self.__client.loop_start()

    def subscribe(self, topic):
        self.__client.subscribe(topic)

    def publish(self, topic, payload):
        self.__client.publish(topic=topic, payload=payload)

    def set_on_connect(self, cb):
        self.__client.on_connect = cb

    def set_on_disconnect(self, cb):
        self.__client.on_disconnect = cb

    def set_on_message(self, cb):
        self.__client.on_message = cb

    def set_on_publish(self, cb):
        self.__client.on_publish = cb
