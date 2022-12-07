N = int(input("N ? "))

levelArray = []
stairArray = []

for i in range(0, N):
    level = int(input("Omr " + str(i+1) + ", vån ? "))
    stair = input("Omr " + str(i+1) + ", tr ? ")

    levelArray.append(level)
    stairArray.append(stair)

for x in range(0, len(levelArray)):
    try:
        levelDiff = abs(levelArray[x] - levelArray[x+1])
    except:
        levelDiff = levelArray[x]
    
    currentLevel = levelArray[x]
    currentstair = str(stairArray[x])
    currentstair.split()
    print(currentstair)
    