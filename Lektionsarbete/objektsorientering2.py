class bil:
    antalbilar = 0
    __maxHastighet = 0
    def __init__(self, maxHastighet):
        self.__maxHastighet = maxHastighet
        bil.antalbilar += 1
    def getMaxHastighet(self):
        return self.__maxHastighet
    def setMaxHastighet(self, maxHastighet):
        self.__maxHastighet = maxHastighet
    @staticmethod
    def milesToKm (miles):
        return 1.6093 * miles

bil1 = bil(180)
bil2 = bil(90)
bil3 = bil(0)

print(bil.antalbilar)

print(bil.milesToKm(15))