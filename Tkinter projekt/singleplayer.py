from tkinter import *

import random

root = Tk()

def start_singleplayer():
    for i in range(0,5):
        row = random.randint(0, 4)
        column = random.randint(0, 4)
        setup
def start_multiplayer():
    None

singleplayer = Button(text="1 player", command=lambda : [start_singleplayer(), multiplayer.place_forget(), singleplayer.place_forget()])
singleplayer.place(relx=0.2,rely=0.9,anchor="w")

multiplayer = Button(text="2 players", command=lambda : [start_multiplayer(), multiplayer.place_forget(), singleplayer.place_forget()])
multiplayer.place(relx=0.8,rely=0.9,anchor="e")


root.mainloop()