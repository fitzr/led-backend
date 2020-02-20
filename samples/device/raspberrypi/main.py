import time
import sys
import json
from led import mqtt as mq, state, gpio

UPDATE_TOPIC = '$aws/things/TestThing/shadow/update'
DELTA_TOPIC = '$aws/things/TestThing/shadow/update/delta'

state = state.State()
mqtt = mq.Mqtt()
gpio = gpio.Gpio()


def on_connect(client, userdata, flag, rc):
    print('connected rc:{}'.format(rc))
    mqtt.subscribe(DELTA_TOPIC)
    report_state()


def on_disconnect(client, userdata, flag, rc):
    print('disconnected rc:{}'.format(rc))
    sys.exit()


def on_message(client, userdata, msg):
    print('received msg:{}'.format(msg.payload))
    update_state(msg.payload)


def on_publish(client, userdata, mid):
    print('publish mid:{}'.format(mid))


def update_state(payload):
    requested_state = json.loads(payload)['state']
    for k, v in requested_state.items():
        if k in ['power', 'color', 'brightness']:
            getattr(gpio, k)(v)
    state.update(requested_state)
    report_state()


def report_state():
    mqtt.publish(UPDATE_TOPIC, json.dumps({'state': {'reported': state.get()}}))


def keep_reporting():
    while True:
        time.sleep(60)
        report_state()


if __name__ == '__main__':
    mqtt.set_on_connect(on_connect)
    mqtt.set_on_disconnect(on_disconnect)
    mqtt.set_on_message(on_message)
    mqtt.set_on_publish(on_publish)
    mqtt.connect()

    keep_reporting()
