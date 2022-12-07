#Dragkamp

amount1 = int(input("Antal ettor ? "))
amount2 = int(input("Antal tvåor ? "))
amount3 = int(input("Antal treor ? "))
amount4 = int(input("Antal fyror ? "))

studentsArray = []

teamArray = []

studentsArray.append(amount1)
studentsArray.append(amount2)
studentsArray.append(amount3)
studentsArray.append(amount4)

studentsArray.reverse()

equaliser = 0

for i in range (0,4):
    if studentsArray[i] % 2 == 0:
        amount = int(studentsArray[i] / 2)
        
    elif equaliser < 1:
        amount = int((studentsArray[i] + 1) / 2)
        equaliser += 5 - i
    
    else:
        amount = int((studentsArray[i] - 1) / 2)
        equaliser -= 5 - i
    
    teamArray.append(amount)

teamArray.reverse()

print(*teamArray, sep=", ")
