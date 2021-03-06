
class State:
    def __init__(self):
        self.__state = {
            'connection': 'active',
            'power': 'off',
            'brightness': 50,
            'color': 'white'
        }

    def update(self, state):
        self.__state.update(state)

    def get(self):
        return self.__state.copy()
