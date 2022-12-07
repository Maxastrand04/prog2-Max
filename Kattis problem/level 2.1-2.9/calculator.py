myinput = input(":")

for i in range (0, len(myinput)):
    typeOfInput = myinput[i]
    if typeOfInput == "*":
        if i == 0:
            print("you cannot start with [*, /, +, -]")
            break
        else:
            number1 = int(myinput[i-1])
            number2 = int(myinput[i+1])
            result = number1*number2
            print(result)
    if typeOfInput == "/":
        if i == 0:
            print("you cannot start with [*, /, +, -]")
            break
        else:
            number1 = int(myinput[i-1])
            number2 = int(myinput[i+1])
            result = number1/number2
            print(result)
    if typeOfInput == "+":
        if i == 0:
            print("you cannot start with [*, /, +, -]")
            break
        else:
            number1 = int(myinput[i-1])
            number2 = int(myinput[i+1])
            result = number1+number2
            print(result)
    if typeOfInput == "-":
        if i == 0:
            print("you cannot start with [*, /, +, -]")
            break
        else:
            number1 = int(myinput[i-1])
            number2 = int(myinput[i+1])
            result = number1-number2
            print(result)
    

