run = True

while run == True:
    ytViktKuvert = input("Kuvert ? ")
    try:
        ytViktKuvert = int(ytViktKuvert)
        run = False
    except:
        print("OBS! felaktig input!")

run = True

while run == True:
    ytViktAffish = input("Affish ? ")
    try:
        ytViktAffish = int(ytViktAffish)
        run = False
    except:
        print("OBS! felaktig input!")

run = True

while run == True:
    ytViktBlad = input("Blad ? ")
    try:
        ytViktBlad = int(ytViktBlad)
        run = False
    except:
        print("OBS! felaktig input!")


if 50 <= ytViktKuvert <= 200 and 50 <= ytViktAffish <= 200 and 50 <= ytViktBlad <= 200:
    None
else: 
    print("Måste vara mellan 50-200")

class Kuvert():
    def __init__(self, ytvikt):
        self.height = 229 / 1000
        self.width = 324 / 1000
        self.ytvikt = ytvikt
    
    def __getArea(self):
        return self.height * self.width * 2

    def getVikt(self):
        area = self.__getArea()
        vikt = self.ytvikt * area
        return vikt


class Affish():
    def __init__(self, ytvikt):
        self.height = 297 / 1000
        self.width = 420 / 1000
        self.ytvikt = ytvikt
    
    def __getArea(self):
        return self.height * self.width * 2

    def getVikt(self):
        area = self.__getArea()
        vikt = self.ytvikt * area
        return vikt

class Blad():
    def __init__(self, ytvikt):
        self.height = 210 / 1000
        self.width = 297 / 1000
        self.ytvikt = ytvikt
    
    def __getArea(self):
        return self.height * self.width
    
    def getVikt(self):
        area = self.__getArea()
        vikt = self.ytvikt * area
        return vikt

mittKuvert = Kuvert(ytViktKuvert)
minAffish = Affish(ytViktAffish)
mittBlad = Blad(ytViktBlad)

kuvertVikt = mittKuvert.getVikt()
affishVikt = minAffish.getVikt()
bladVikt = mittBlad.getVikt()

print(kuvertVikt + affishVikt + bladVikt)