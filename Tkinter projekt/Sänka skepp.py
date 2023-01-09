from tkinter import *

import random

players = ["MATS", "TjokisMILLA"]   #En lista för att kunna ändra namnen på spelarna som kör

turn = players[0] #Spelare 1 börjar

ships_player1 = 5   #Antalet skepp för spelare 1

ships_player2 = 5   #Antalet skepp för spelare 2
 
points = [0, 0, 0]     #Poängräknare [0] = spelare 1, [1] = spelare 2, [2] = AI

singleplayer_check = False

def hit_ships(row, column, team):   #funktion för när man ska skjuta skepp

    #row = vilken rad
    #column = vilken kolumn
    #team = vilken spelare som kör

    #Tar in globala variabler som ska förändras i programmet
    global turn
    global points

    if singleplayer_check == False:
        if turn == players[0]:  #Kollar om det är första spelarens tur
        
            if team == 1:   #Kollar om det är den första spelaren som trycker

                if board1_gameplay[row][column]["text"] == "":  #Kollar ifall rutan är tom

                    if board2_setup[row][column]["text"] != "": #Kollar ifall den rutans koordinater matchar motståndarens utplacerade skepp
                        
                        board1_gameplay[row][column].config(text= "X", bg="red")    #fyller i rutan som en träff

                        points[0] += 1  #Ger poäng till spelare 1
                        
                    else:
                
                        board1_gameplay[row][column].config(text="O", bg="grey")    #fyller i rutan som en miss
                
                    turn = players[1]   #Ser till att det blir varannan runda


                    if check_win(1) is True:    #Kollar om spelare 1 har vunnit och avbryter spelet
                        label.config(text=(players[0] + " Vann!"))
                        frame1_gameplay.place_forget()
                        frame2_gameplay.place_forget()
                
                    else:   #Ifall spelare 1 inte har vunnit så går rundan över till nästa spelare
                        label.config(text=(turn + " tur"))
        

        #Nästa del är samma som första delen men för spelare två

        elif turn == players[1]:    
        
            if team == 2:

                if board2_gameplay[row][column]["text"] == "":  

                    if board1_setup[row][column]["text"] != "":
                
                        board2_gameplay[row][column].config(text= "X", bg="red")

                        points[1] += 1 #Ger poäng till spelare 2

                    else:
                
                        board2_gameplay[row][column].config(text="O", bg="grey")
                
                    turn = players[0]   #Ser till att det blir varannan runda
                
                    if check_win(2) is True:
                        label.config(text=(players[1] + " Vann!"))
                        frame1_gameplay.place_forget()
                        frame2_gameplay.place_forget()
                    else:
                        label.config(text=(turn + " tur"))

        return turn

    elif singleplayer_check == True:

        if board1_gameplay[row][column]["text"] == "":  #Kollar ifall rutan är tom

            if board_AI[row][column]["text"] != "": #Kollar ifall den rutans koordinater matchar motståndarens utplacerade skepp
                    
                board1_gameplay[row][column].config(text= "X", bg="red")    #fyller i rutan som en träff
                
                points[0] += 1  #Ger poäng till spelare 1

                label.config(text=("Du har "+ str(5-points[0]) + " skepp kvar att träffa"))
            else:
                board1_gameplay[row][column].config(text= "O", bg="grey")

                
            if check_win(1) is True:    #Kollar om spelare 1 har vunnit och avbryter spelet
                label.config(text=(players[0] + " Vann!"))
                frame_AI_gameplay.place_forget()

            while True:
            
                AI_row = random.randint(0,4)
                AI_column = random.randint(0,4)
            
                if board_AI_gameplay[AI_row][AI_column]["text"] == "":
                    
                    if board1_setup[AI_row][AI_column]["text"] != "":

                        board_AI_gameplay[AI_row][AI_column].config(text= "X", bg="red")

                        points[2] += 1
                    else:
                        board_AI_gameplay[AI_row][AI_column].config(text= "O", bg="grey")
                
                    if check_win(1) is True:
                        None
                    elif check_win("AI") is True:    #Kollar om spelare 1 har vunnit och avbryter spelet
                        label.config(text="Du förlorade :(")
                        frame1_gameplay.place_forget()
                
                    break


def place_ships(row, column, team):
    
    #row = vilken rad
    #column = vilken kolumn
    #team = vilken spelare som kör

    #Importerar de globala variablerna som ska ändras
    global ships_player1
    global ships_player2
    global singleplayer_check


    if ships_player1 > 0 and team == 1 and board1_setup[row][column]["text"] == "": #Kollar så spelaren har skepp att sätta ut och trycker på en tom ruta

        ships_player1 -= 1  #Tar bort ett av skeppen
        if singleplayer_check is False:
            label.config(text=(players[0] + " har " + str(ships_player1) + " skepp kvar att sätta ut!"))    #Skriver ut hur många skepp som måste sättas ut
        else:
            label.config(text=("Du har " + str(ships_player1) + " skepp kvar att sätta ut!"))
        board1_setup[row][column].config(text="S", bg="red")    #Ändrar rutan för att visa att skeppet är placerat


    elif ships_player1 >= 0 and board1_setup[row][column]["text"] != "":    #Ifall man trycker på ett skepp så ska det tas bort

        ships_player1 += 1  #Lägger till en till variabeln som berättar hur många som behövs sättas ut

        label.config(text=(players[0] + " har " + str(ships_player1) + " skepp kvar att sätta ut!"))    #Skriver ut hur många skepp som måste sättas ut

        board1_setup[row][column].config(text="",bg="#F0F0F0")  #Ändrar knappen till ordinarie stadie

    #Ändrar färgen på "CONFIRM" knappen när det går att trycka
    if ships_player1 <= 0:
        player1_setup_button.config(bg="green")
        setup_button.config(bg="green")
    else:
        setup_button.config(bg="#F0F0F0")
        player1_setup_button.config(bg="#F0F0F0")

    #Samma som första delen av funktionen men för spelare 2

    if ships_player2 > 0 and team == 2 and board2_setup[row][column]["text"] == "":  

        ships_player2 -= 1

        label.config(text=(players[1] + " har " + str(ships_player2) + " skepp kvar att sätta ut!"))

        board2_setup[row][column].config(text="S", bg="red")

    
    elif ships_player2 >= 0 and board2_setup[row][column]["text"] != "":

        ships_player2 += 1

        label.config(text=(players[1] + " har " + str(ships_player2) + " skepp kvar att sätta ut!"))

        board2_setup[row][column].config(text="",bg="#F0F0F0")


    if ships_player2 <= 0:
        player2_setup_button.config(bg="green")
    else:
        player2_setup_button.config(bg="#F0F0F0")

def place_ships_AI():   #Slumpar placeringen av skepp som AI:N sätter ut

    AI_ships = 5

    while AI_ships >= 0:
        row = random.randint(0,4)
        column = random.randint(0,4)
        if board_AI[row][column]["text"] == "":
            board_AI[row][column].config(text="S")
            AI_ships -= 1



def check_win(player):  #Kollar ifall en spelare har vunnit genom att man har skutit alla 5 skepp

    #player = vilken spelare som ska kollas

    global points #För att kunna kolla på en global variabel

    if player == 1: #Kollar ifall spelare 1 har vunnit
        if points[0] == 5:
            return True

    elif player == 2:   #Kollar ifall spelare 2 har vunnit
        if points[1] == 5:
            return True

    elif player == "AI":    #Kollar ifall AI:n har vunnit
        if points[2] == 5:
            return True

def new_game():

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


    #Skapar knapparna för AI brädet
    for row in range(5):

        for column in range(5):

            board_AI_gameplay[row][column] = Button(frame_AI_gameplay, text="", font=("consolas", 40), width=3, height=1)

            board_AI_gameplay[row][column].grid(row=row,column=column)

    for row in range(5):

        for column in range(5):

            board_AI[row][column] = Button(frame_AI, text="", font=("consolas", 40), width=3, height=1)

            board_AI[row][column].grid(row=row,column=column)

    #Tar in alla globala variabler för att kunna nollställa dem
    global ships_player1 
    global ships_player2
    global points
    global singleplayer_check 

    ships_player1 = 5
    ships_player2 = 5
    
    points = [0,0,0]

    singleplayer_check = False

    player1_setup_button.config(bg="#F0F0F0") #Ser till att "CONFIRM" knappen inte är grön
    player2_setup_button.config(bg="#F0F0F0")
    
    for item in window.place_slaves():
        item.place_forget()
    
    label.config(text=("Välkommen till sänka skepp! är det en eller två spelare?"))
    label.place(relx=0.5, anchor="n")

    singleplayer.place(relx=0.2,rely=0.9,anchor="w")
    multiplayer.place(relx=0.8,rely=0.9,anchor="e")



  

def fix_function(): #Ser till att när man har tryckt på confirm kan så kan inte skeppen tas bort eller flytta
    
    global ships_player1
    global ships_player2

    if ships_player1 >= 0:
        ships_player1 -= 1

    else:
        ships_player2 -= 1


def confirm(team):  #Funktion för när man ska godkänna positionerna för skeppen
    
    if ships_player1 <= 0:  #Kollar så alla skeppen är placerade

        if team == 1: #Kollar så att det är första spelaren som godkänner
            frame1.place_forget()   #Döljer den ordinarie brädet
            player1_setup_button.place_forget() #Tar bort "CONFIRM" knappen
            player2_setup_button.place(relx=0.5,rely=0.5,anchor="center") #Sätter ut nästa spelares "CONFIRM" knapp
            fix_function()  #Ser till att det inte går att ta bort skepp när man har tryckt
            label.config(text=(players[1] + " har " + str(ships_player2) + " skepp kvar att sätta ut!")) #Skriver ut att nästa spelare ska sätta ut
            frame2.place(relx= 1, rely= 1, anchor="se")


    if ships_player2 <= 0:  #Kollar så alla skeppen är placerade
        if team == 2: #Kollar så det är den andra personen som confirmar
            frame2.place_forget()
            frame1_gameplay.place(relx=0,rely=1,anchor="sw") #Sätter ut det nya brädet för att skjuta
            frame2_gameplay.place(relx=1,rely=1,anchor="se")
            player2_setup_button.place_forget()
            fix_function()
            label.config(text=(players[0] + " tur"))


    #För enspelare
    if ships_player1 <= 0:
        if team == 3:
            frame1.place_forget() 
            setup_button.place_forget() 
            frame1_gameplay.place(relx= 0, rely=1, anchor="sw")
            frame_AI_gameplay.place(relx= 1, rely= 1, anchor="se") 
            label.config(text=("Du har "+ str(5-points[0]) + " skepp kvar att träffa"))
            fix_function()

def start_singleplayer():

    global singleplayer_check 
    singleplayer_check = True
    
    frame1.place(relx= 0, rely= 1, anchor="sw") #Vilken position brädet har
    restart_button.place(relx= 0.5, rely= 0.2, anchor="n")

    label.config(text=("Du har "+ str(ships_player1) + " skepp kvar att sätta ut"))
    setup_button.place(relx=0.5,rely=0.5,anchor="center") #Placeras ut direkt
    place_ships_AI()


def start_multiplayer():
    
    frame1.place(relx= 0, rely= 1, anchor="sw") #Vilken position brädet har

    label.config(text=(players[0] + " har " + str(ships_player1) + " skepp kvar att sätta ut!"))
    
    restart_button.place(relx=0.5,rely=0.2,anchor="n")

    player1_setup_button.place(relx=0.5,rely=0.5,anchor="center") #Placeras ut direkt




#_______________________________________________________Programmet startar_____________________________________________________________________

window = Tk()   #skapar ett fönster/rot

window.title("Battle Ships")    #ger rutan en titel

#En rubrik som ändras beroende på vad som sker i spelet för att ge information om vad man ska göra etc
label = Label(text=("Välkommen till sänka skepp! är det en eller två spelare?"), font=("consoloas", 32))
label.place(relx=0.5, anchor="n")

#Knapparna för att välja vilket "gamemode" man vill spela
singleplayer = Button(window, text="1 player", command=lambda : [start_singleplayer(), multiplayer.place_forget(), singleplayer.place_forget()])
singleplayer.place(relx=0.2,rely=0.9,anchor="w")

multiplayer = Button(window, text="2 players", command=lambda : [start_multiplayer(), multiplayer.place_forget(), singleplayer.place_forget()])
multiplayer.place(relx=0.8,rely=0.9,anchor="e")


#Knapp för att starta om spelet
restart_button = Button(text="restart", font=("consoloas", 20), command=new_game)


#En tom lista för knapparna att läggas in i en 5x5 storlek
board1_setup = [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                ]


board2_setup = [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                ]



#Bräde för själva spelgången när man ska skjuta
board1_gameplay =   [[0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    ]


board2_gameplay =   [[0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                ]

#Bräden för AI i singleplayer
board_AI =      [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                ]

board_AI_gameplay = [[0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    [0,0,0,0,0],
                    ]


#Lägger även in detta i en frame för att kunna presentera brädet och kunna ta bort och lägga till enskilda bräden
frame1 = Frame(window)

frame2_gameplay = Frame(window)

frame1_gameplay = Frame(window)

frame2 = Frame(window)

frame_AI = Frame(window)

frame_AI_gameplay = Frame(window)

#Knapp för att godkänna postionen av skeppen

setup_button = Button(text="Confirm", font=("consoalas", 20), command=lambda: confirm(3))

player1_setup_button = Button(text="Confirm", font=("consoloas", 20), command=lambda :confirm(1)) 

player2_setup_button = Button(text="Confirm", font=("consoloas", 20), command=lambda :confirm(2))


#Loopar för att skapa knapparna till spelbrädet
#En loop för varje bräde
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


#Skapar knapparna för AI brädet
for row in range(5):

    for column in range(5):

        board_AI_gameplay[row][column] = Button(frame_AI_gameplay, text="", font=("consolas", 40), width=3, height=1)

        board_AI_gameplay[row][column].grid(row=row,column=column)

for row in range(5):

    for column in range(5):

        board_AI[row][column] = Button(frame_AI, text="", font=("consolas", 40), width=3, height=1)

        board_AI[row][column].grid(row=row,column=column)

window.mainloop()