
#-------------------------------------------------------------övning 1----------------------------------------------------------------
def myfunction (*input):
    sum = 0
    for arg in input:
        sum += arg
    print(sum)

myfunction(15,12,15)

#-------------------------------------------------------------övning 2----------------------------------------------------------------
def food (input, vegan = False):
    if vegan == True:
        print("sojamjölk")
    else:
        print(input)

food("mjölk")
food("mjölk", True)