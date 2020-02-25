import paho.mqtt.client as mqtt

PORT = 8883


class Mqtt:
    def __init__(self, endpoint, ca_file, cert_file, key_file, thing_name):
        self.__client = mqtt.Client(client_id=thing_name)
        self.__client.tls_set(ca_certs=ca_file, certfile=cert_file, keyfile=key_file)
        self.__endpoint = endpoint

    def connect(self):
        self.__client.connect(self.__endpoint, PORT)
        self.__client.loop_start()

    def subscribe(self, topic):
        self.__client.subscribe(topic)

    def publish(self, topic, payload):
        self.__client.publish(topic=topic, payload=payload)

    def set_on_connect(self, cb):
        self.__client.on_connect = lambda client, userdata, flag, rc: cb(rc)

    def set_on_disconnect(self, cb):
        self.__client.on_disconnect = lambda client, userdata, flag, rc: cb(rc)

    def set_on_message(self, cb):
        self.__client.on_message = lambda client, userdata, msg: cb(msg)

    def set_on_publish(self, cb):
        self.__client.on_publish = lambda client, userdata, mid: cb(mid)
