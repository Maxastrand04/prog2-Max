line = input("type two numbers :")
a, b = line.split()
a = int(a)
b = int(b)

if a < b:
    print(a, b)
else:
    print(b, a)