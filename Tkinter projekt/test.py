from tkinter import *

root = Tk()

text = StringVar()
entry = Entry(root, textvariable=text)
entry.grid(row=0, column=0)

def show(*args):
    entry.bind("<Return>", myfunc)
    
    print(text.get())

def myfunc(*args):
    try:
        myinput = text.get()
        int(myinput)
        print("success")
    except:
        print("try again")

text.trace_add("write", show)

root.mainloop()