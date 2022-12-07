from tkinter import *

root = Tk()

yes = Button(text="du lyckas")

button = Button(text="click me", command=lambda : [yes.pack(), button.pack_forget()])
button.pack()
root.mainloop()