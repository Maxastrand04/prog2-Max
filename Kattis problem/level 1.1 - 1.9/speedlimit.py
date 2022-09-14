from time import time


loops = int(input("hur många mätvärden finns det :"))

time_diff = 0
distancelist = []

for x in range(0, loops):
    data = input(":")
    speed, timer = data.split()
    speed = int(speed)
    timer = int(timer)

    active_time = timer - time_diff

    time_diff = timer

    distance = active_time * speed

    distancelist += [distance]

for i in range (0, len(distancelist)):
    print(distancelist[i])

