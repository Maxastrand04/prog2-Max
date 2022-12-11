from tkinter import *

import random

players = ["1", "2"]

turn = players[0] #Spelare 1 börjar

ships_player1 = 5   #Antalet skepp för spelare 1

ships_player2 = 5   #Antalet skepp för spelare 2
 
points = [0, 0]     #Poängräknare

def hit_ships(row, column, team):

    global turn

    global points

    if turn == players[0]:
        
        if team == 1:

            if board1_gameplay[row][column]["text"] == "":

                if board2_setup[row][column]["text"] != "":
                
                    board1_gameplay[row][column].config(text= "X", bg="red")

                    points[0] += 1  #Ger poäng till spelare 1

                    if check_win(1) is True:
                        label.config(text=(players[0] + " Vann!"))
                else:
                
                    board1_gameplay[row][column].config(text="O", bg="grey")
                
                turn = players[1]   #Ser till att det blir varannan runda

                label.config(text=("Spelare " + turn + " tur"))
        

        

    elif turn == players[1]:
        
        if team == 2:

            if board2_gameplay[row][column]["text"] == "":

                if board1_setup[row][column]["text"] != "":
                
                    board2_gameplay[row][column].config(text= "X", bg="red")

                    points[1] += 1 #Ger poäng till spelare 2

                    if check_win(2) is True:
                        label.config(text=(players[1] + " Vann!"))
                else:
                
                    board2_gameplay[row][column].config(text="O", bg="grey")
                
                turn = players[0]   #Ser till att det blir varannan runda

                label.config(text=("Spelare " + turn + " tur"))

    print(points)
    return turn
 

def place_ships(row, column, team):

    global ships_player1

    global ships_player2

    if ships_player1 > 0 and team == 1 and board1_setup[row][column]["text"] == "":

        ships_player1 -= 1

        label.config(text=(players[0] + " har " + str(ships_player1) + " skepp kvar att sätta ut!"))

        board1_setup[row][column].config(text="S", bg="red")


    elif ships_player1 >= 0 and board1_setup[row][column]["text"] != "":

        ships_player1 += 1

        label.config(text=(players[0] + " har " + str(ships_player1) + " skepp kvar att sätta ut!"))

        board1_setup[row][column].config(text="",bg="#F0F0F0")

 

    elif ships_player2 > 0 and team == 2 and board2_setup[row][column]["text"] == "":

        ships_player2 -= 1

        label.config(text=(players[1] + " har " + str(ships_player2) + " skepp kvar att sätta ut!"))

        board2_setup[row][column].config(text="S", bg="red")

    
    elif ships_player2 >= 0 and board2_setup[row][column]["text"] != "":

        ships_player2 += 1

        label.config(text=(players[1] + " har " + str(ships_player2) + " skepp kvar att sätta ut!"))

        board2_setup[row][column].config(text="",bg="#F0F0F0")

def check_win(player):
    global points

    if player == 1:
        if points[0] == 5:
            return True

    elif player == 2:
        if points[1] == 5:
            return True

def new_game():

    None

def fix_function(): #Ser till att när man har tryckt på confirm kan så kan inte skeppen tas bort eller flytta
    
    global ships_player1
    global ships_player2

    if ships_player1 >= 0:
        ships_player1 -= 1

    else:
        ships_player2 -= 1

window = Tk()

window.title("Battle Ships")


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


player1_setup_button = Button(text="Confirm", font=("consoloas", 20), command=lambda: [frame1.pack_forget(), frame1_gameplay.pack(side="left"), player1_setup_button.pack_forget(), player2_setup_button.pack(), fix_function(),
                             label.config(text=(players[1] + " har " + str(ships_player2) + " skepp kvar att sätta ut!")) ]) 
player1_setup_button.pack(side="left")


board2_gameplay =   [[0,0,0,0,0],

                    [0,0,0,0,0],

                    [0,0,0,0,0],

                    [0,0,0,0,0],

                    [0,0,0,0,0],

                ]


player2_setup_button = Button(text="Confirm", font=("consoloas", 20), command=lambda: [frame2.pack_forget(), frame2_gameplay.pack(side="right"), player2_setup_button.pack_forget(), fix_function()]) 


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