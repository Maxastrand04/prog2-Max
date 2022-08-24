amount_of_words = int(input(":"))
mylist = []

for i in range (0, amount_of_words):
    echoing = input(":")
    if i % 2 == 0:
        mylist += [echoing]
    else:
        None
    i+=1

for i in range (0, len(mylist)):
    print(mylist[i])
    i+=1
