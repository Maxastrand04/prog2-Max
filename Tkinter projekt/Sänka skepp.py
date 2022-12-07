from tkinter import *

import random

 

def next_turn(row, column):

    print("hi")

 

def check_winner():

    print("no")

 

def hit_ships(row, column, team):

    global turn

    if turn == players[0]:
        
        turn = players[1]   #Ser till att det blir varannan runda
        
        if team == 1:
            if board2_setup[row][column]["text"] != "":
                
                board1_gameplay[row][column]["text"] = "X"
                board1_gameplay[row][column].config(bg="red")
            else:
                
                board1_gameplay[row][column]["text"] = "O"
                board1_gameplay[row][column].config(bg="grey")
        label.config(text=(turn + " spelares tur"))
    if turn == players[1]:
        
        turn = players[0]   #Ser till att det blir varannan runda
        
        if team == 2:
            if board1_setup[row][column]["text"] != "":
                
                board2_gameplay[row][column]["text"] = "X"
                board2_gameplay[row][column].config(bg="red")
            else:
                
                board2_gameplay[row][column]["text"] = "O"
                board2_gameplay[row][column].config(bg="grey")
        label.config(text=(turn + " spelares tur"))
 

def place_ships(row, column, team):

    global ships_player1

    global ships_player2

    if ships_player1 > 0 and team == 1 and board1_setup[row][column]["text"] == "":

        ships_player1 -= 1

        label.config(text=(players[0] + " har " + str(ships_player1) + " skepp kvar att sätta ut!"))

       

        board1_setup[row][column]["text"] = "S"

        board1_setup[row][column].config(bg="red")

 

    elif ships_player2 > 0 and team == 2 and board2_setup[row][column]["text"] == "":

        ships_player2 -= 1

        label.config(text=(players[1] + " har " + str(ships_player2) + " skepp kvar att sätta ut!"))

        board2_setup[row][column]["text"] = "S"

        board2_setup[row][column].config(bg="red")

       

def new_game():

    None

 

window = Tk()

window.title("Battle Ships")

 

players = ["1", "2"]

turn = players[0]

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


board1_gameplay =   [[0,0,0,0,0],

                    [0,0,0,0,0],

                    [0,0,0,0,0],

                    [0,0,0,0,0],

                    [0,0,0,0,0],

                    ]


frame1_gameplay = Frame(window)


player1_setup_button = Button(text="Confirm", font=("consoloas", 20), command=lambda: [frame1.pack_forget(), frame1_gameplay.pack(side="left"), player1_setup_button.pack_forget(), player2_setup_button.pack()]) 
player1_setup_button.pack(side="left")


board2_gameplay =   [[0,0,0,0,0],

                    [0,0,0,0,0],

                    [0,0,0,0,0],

                    [0,0,0,0,0],

                    [0,0,0,0,0],

                ]


player2_setup_button = Button(text="Confirm", font=("consoloas", 20), command=lambda: [frame2.pack_forget(), frame2_gameplay.pack(side="right"), player2_setup_button.pack_forget()]) 


frame2_gameplay = Frame(window)

for row in range(5):

    for column in range(5):

        board1_setup[row][column] = Button(frame1, text="", font=("consolas", 40), width=3, height=1, command= lambda row=row, column=column: place_ships(row, column, 1))

        board1_setup[row][column].grid(row=row,column=column)

 

for row in range(5):

    for column in range(5):

        board2_setup[row][column] = Button(frame2, text="", font=("consolas", 40), width=3, height=1, command= lambda row=row, column=column: place_ships(row, column, 2))

        board2_setup[row][column].grid(row=row,column=column)



for row in range(5):

    for column in range(5):

        board1_gameplay[row][column] = Button(frame1_gameplay, text="", font=("consolas", 40), width=3, height=1, command= lambda row=row, column=column: hit_ships(row, column, 1))

        board1_gameplay[row][column].grid(row=row,column=column)


for row in range(5):

    for column in range(5):

        board2_gameplay[row][column] = Button(frame2_gameplay, text="", font=("consolas", 40), width=3, height=1, command= lambda row=row, column=column: hit_ships(row, column, 2))

        board2_gameplay[row][column].grid(row=row,column=column)

window.mainloop()