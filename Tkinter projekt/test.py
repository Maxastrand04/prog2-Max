from tkinter import *

root = Tk()

yes = Button(text="du lyckas")

button = Button(text="click me", command=lambda : [yes.pack(), button.place_forget()])
button.place(relx=0,rely=0.9,anchor="w")
root.mainloop()