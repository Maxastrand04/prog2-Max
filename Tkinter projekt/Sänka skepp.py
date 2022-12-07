from tkinter import *

import random

 

def next_turn(row, column):

    print("hi")

 

def check_winner():

    print("no")

 

def hit_ships():

    None

 

def place_ships(row, column, team):

    global ships_player1

    global ships_player2

    if ships_player1 > 0 and team == 1:

        ships_player1 -= 1

        label.config(text=(players[0] + " har " + str(ships_player1) + " skepp kvar att sätta ut!"))

       

        board1_setup[row][column]["text"] = "S"

        board1_setup[row][column].config(bg="red")

 

    elif ships_player2 > 0 and team == 2:

        ships_player2 -= 1

        label.config(text=(players[1] + " har " + str(ships_player2) + " skepp kvar att sätta ut!"))

        board2_setup[row][column]["text"] = "S"

        board2_setup[row][column].config(bg="red")

       

def new_game():

    None

 

window = Tk()

window.title("Battle Ships")

 

players = ["1", "2"]

ships_player1 = 5

ships_player2 = 5

 

board1_setup = [[0,0,0,0,0],

                [0,0,0,0,0],

                [0,0,0,0,0],

                [0,0,0,0,0],

                [0,0,0,0,0],

                ]

 

frame1 = Frame(window)

frame1.pack(side="left")

 

board2_setup = [[0,0,0,0,0],

                [0,0,0,0,0],

                [0,0,0,0,0],

                [0,0,0,0,0],

                [0,0,0,0,0],

                ]

 

frame2 = Frame(window)

frame2.pack(side="right")

 

label = Label(text=(players[0] + " har " + str(ships_player1) + " skepp kvar att sätta ut!"), font=("consolas", 40))

label.pack(side="top")

 

reset_button = Button(text="restart", font=("consoloas", 20), command=new_game)

reset_button.pack(side="top")

 

for row in range(5):

    for column in range(5):

        board1_setup[row][column] = Button(frame1, text="", font=("consolas", 40), width=3, height=1, command= lambda row=row, column=column: place_ships(row, column, 1))

        board1_setup[row][column].grid(row=row,column=column)

 

for row in range(5):

    for column in range(5):

        board2_setup[row][column] = Button(frame2, text="", font=("consolas", 40), width=3, height=1, command= lambda row=row, column=column: place_ships(row, column, 2))

        board2_setup[row][column].grid(row=row,column=column)





window.mainloop()