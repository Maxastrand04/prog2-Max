from tkinter import *

root = Tk()
E1 = Entry(root)
E1.pack()
E2 = Entry(root)
E2.pack()
lbl = Label(root)
lbl.pack()
b = Button(root, text="Addera")
def click_handler(self):
    nbr1 = int(E1.get())
    nbr2 = int(E2.get())
    sum = nbr1+nbr2
    lbl["text"] = sum
b.bind("<Button-1>", click_handler)
b.pack()
root.mainloop()