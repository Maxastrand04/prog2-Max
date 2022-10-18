class Djur:
    def __init__(self, namn):
        self.namn = namn
    def at(self):
        print("nom nom nom")
    def sov(self):
        print("Sleepy boi")

class Fågel(Djur):
    def __init__(self, namn, vingspann):
        super().__init__(namn)
        self.vingspann = vingspann

class Fisk(Djur):
    def __init__(self, namn, maxdjup):
        super().__init__(namn)
        self.maxdjup = maxdjup
    def simma(self):
        print("Fisken simmar")

class Torsk(Fisk):
    def __init__(self, namn, maxdjup, hastighet):
        super().__init__(namn, maxdjup)
        self.hastighet = hastighet

class Haj(Fisk):
    def __init__(self, namn, maxdjup, antalTänder):
        super().__init__(namn, maxdjup)
        self.antalTänder = antalTänder
    def at(self, djur):
        print("hajen äter", djur, "smaskens!")        


Torsken = Torsk("Torsken", 300, 30)

Hajen = Haj("Hajen", 200, 40)

def fånga():
    if Torsken.hastighet >= 30 and Torsken.maxdjup - Hajen.maxdjup > 0:
        print("bra")
    else:
        print("dåligt")

fånga()

Hajen.at("fisk")
Torsken.simma()