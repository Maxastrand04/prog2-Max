class Elev:
    def __init__(self, namn, ålder, godkänd):
        self.namn = namn
        self.ålder = ålder
        self.godkänd = godkänd

    def glad (self):
        if self.godkänd == True:
            return "glad"
        else:
            return "ledsen"

    def utskrift (self):
        glädje = self.glad()
        print("ditt namn är: ", self.namn, "\nDin ålder är: ", self.ålder, "\nDu är :", glädje)

Max = Elev("Max", 18, True)

Max.utskrift()