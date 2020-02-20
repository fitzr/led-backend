#!/usr/bin/env python
# -*- coding: utf-8 -*-
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
pin=22
GPIO.setup(pin, GPIO.OUT)

while True:
    GPIO.output(pin, 1)
    time.sleep(1)
    GPIO.output(pin, 0)
    time.sleep(1)
