pjäser = input (":")
pjäser = pjäser.split(" ")
output = ""

try: 
    for i in range (6):
        if i == 0 or i == 1:
            output += str(1-int(pjäser[i]))
        elif i == 2 or i == 3 or i == 4:
            output += str(2-int(pjäser[i]))
        elif i == 5:
            output += str(8-int(pjäser[i]))
        output += " "
except:
    print("fel input")

print(output)