from gpiozero import PWMLED

PIN_NO = {
    'white': 22,
    'green': 27,
    'red': 17,
}
# ON_VALUE = 0.0
OFF_VALUE = 1.0


class Led:
    def __init__(self):
        self.__is_on = False
        self.__color = 'white'
        self.__brightness = 50
        self.__leds = {
            color: PWMLED(no) for color, no in PIN_NO.items()
        }
        for led in self.__leds.values():
            led.value = OFF_VALUE

    def set_led_value(self):
        if self.__is_on:
            led_value = (100 - self.__brightness) / 100
        else:
            led_value = OFF_VALUE
        self.__leds[self.__color].value = led_value

    def power(self, power):
        print('power:{}'.format(power))
        self.__is_on = power == 'on'
        self.set_led_value()

    def brightness(self, brightness):
        print('brightness:{}'.format(brightness))
        self.__brightness = brightness
        self.set_led_value()

    def color(self, color):
        print('color:{}'.format(color))
        if self.__color != color:
            if self.__is_on:
                self.__leds[self.__color].value = OFF_VALUE
            self.__color = color
            self.set_led_value()
