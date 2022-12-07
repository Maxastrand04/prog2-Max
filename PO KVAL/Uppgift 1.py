#Morötter

timeTor = int(input("Tors tid ? "))
timeMor = int(input("Mors tid ? "))

carrots = 40
timer = 1

CarrotsMor = 0
CarrotsTor = 0

while carrots > 0:
    if timer == 1:
        CarrotsMor += 1
        CarrotsTor += 1
        carrots -= 2
    else:
        if carrots == 1 and timer % timeMor == 0 and timer % timeTor == 0:
            break
        else:
            if timer % timeMor == 0:
                CarrotsMor += 1
                carrots -= 1
            if timer % timeTor == 0:
                CarrotsTor += 1
                carrots -= 1
    timer += 1

CarrotsMor = str(CarrotsMor)
CarrotsTor = str(CarrotsTor)

print("Tor " + CarrotsTor + " , Mor " + CarrotsMor)