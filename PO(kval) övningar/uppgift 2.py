from cgitb import text
from turtle import textinput


antal_ord = int(input("Antal ord ? "))
textInput = input("Mening ? ")
textInput.casefold()

ordlista = textInput.split()

vokaler = "aeiouy"
res_str = ""
count = {}.fromkeys(vokaler, 0)

for i in range(0, antal_ord):
    for x in range(0, len(ordlista[i])):
        ord = ordlista[i]
        arab_ord = ""
        if ord[x] in count:
            
            try:
                if ord[x+1] in count:
                    arab_ord = ord
                elif not ord[x+1] in count:
                    arab_ord = ord
                    print("nej")
                else:
                    try:
                        if ord[x+2] in count:
                            arab_ord = ord
                        elif not ord[x+2] in count:
                            arab_ord = ord
                            print("snopp")
                        else:
                            arab_ord = ord[:x] + ord[x+1:] 
                    except:
                        None
            except:
                None
        res_str += arab_ord

print(res_str)
