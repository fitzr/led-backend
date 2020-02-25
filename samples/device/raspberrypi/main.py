import time
import sys
import json
import configparser
from led import mqtt as mq, state, led

CNF_INI = 'config.ini'

config = configparser.ConfigParser()
config.read(CNF_INI, encoding='utf-8')
default_config = config['DEFAULT']

thing_name = default_config['thing_name']

UPDATE_TOPIC = '$aws/things/{}/shadow/update'.format(thing_name)
DELTA_TOPIC = '$aws/things/{}/shadow/update/delta'.format(thing_name)

state = state.State()
mqtt = mq.Mqtt(**default_config)
led = led.Led()


def on_connect(rc):
    print('connected rc:{}'.format(rc))
    mqtt.subscribe(DELTA_TOPIC)
    report_state()


def on_disconnect(rc):
    print('disconnected rc:{}'.format(rc))
    sys.exit()


def on_message(msg):
    print('received msg:{}'.format(msg.payload))
    update_state(msg.payload)


def on_publish(mid):
    print('publish mid:{}'.format(mid))


def update_state(payload):
    requested_state = json.loads(payload)['state']
    for k, v in requested_state.items():
        if k in ['power', 'color', 'brightness']:
            getattr(led, k)(v)
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
