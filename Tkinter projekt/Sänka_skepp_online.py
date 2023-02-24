from tkinter import *
import socket
import threading

players = ["Host", "Joiner"]   #En lista för att kunna ändra namnen på spelarna som kör

you = None  #Vilken spelare du är bestäms senare

turn = players[0]   #Spelare 1 börjar

player_ships = 5    # antalet skepp man ska placera ut
 
points = [0, 0]     #Poängräknare [0] = spelare 1, [1] = spelare 2, [2] = AI

HOST = socket.gethostbyname(socket.gethostname())
PORT = 5050
FORMAT = 'utf-8'

HIT = "hit"
MISS = "miss"
WIN = "win"

client = None

def host_game():
    label.config(text=("Lyssnar på IP-Adress: "+ str(HOST)))
    

    threading.Thread(target=start_listen).start()
    global you 
    you = players[0]

def start_listen():
    global client
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((HOST, PORT))
    server.listen(1)
    client, addr = server.accept()
    
    threading.Thread(target=start_multiplayer).start() 
    server.close()
    

def join_game():
    label.config(text="Skriv in IP-addressen du vill gå med i!")

    global IP_adress, you
    text = StringVar
    IP_adress = Entry(window, textvariable=text)
    IP_adress.place(relx=0.5, rely=0.5, anchor="center")
    
    IP_adress.bind("<Return>", connect_to_server)

    you = players[1]


def connect_to_server(e):
    global client
    host = e.widget.get()

    try:
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.connect((host, PORT))
        threading.Thread(target=start_multiplayer).start()
        IP_adress.place_forget()
        IP_adress.unbind("<Return>")
    except:
        label.config(text="Felaktig adress försök igen")


def hit_ships(row, column):   #funktion för när man ska skjuta skepp

    #row = vilken rad
    #column = vilken kolumn
    #team = vilken spelare som kör

    #Tar in globala variabler som ska förändras i programmet
    global turn, points

    if turn == you:  #Kollar om det är din tur

           #Kollar om det är den första spelaren som trycker

        if gameplay[row][column]["text"] == "":  #Kollar ifall rutan är tom

            square = str(row) +"," + str(column)
            client.send(square.encode(FORMAT))

            data = client.recv(1024)
            if not data:
                client.close()
            else:
                hit_or_miss = data.decode(FORMAT)
                if hit_or_miss == HIT:
                    
                    gameplay[row][column].config(text= "X", bg="red")    #fyller i rutan som en träff

                    points[0] += 1  #Ger poäng till spelare 1
                else:
                    
                    gameplay[row][column].config(text="O", bg="grey")    #fyller i rutan som en miss

            if check_win(1) is True:    #Kollar om spelare 1 har vunnit och avbryter spelet
                label.config(text=(players[0] + " Vann!"))
                gameplay.place_forget()
                setup.place_forget()
                

            if you == players[0]:
                turn = players[1]
            else:
                turn = players[0]
            
            label.config(text=turn + "s tur")
            

            #När din tur är slut så väntar man på att motståndaren ska göra sitt drag
            threading.Thread(target=wait_for_move).start()


def wait_for_move():
    global turn
    data = client.recv(1024)
    if not data:
        client.close()
    else:
        row, column = data.decode(FORMAT).split(',')
        row = int(row)
        column = int(column)
        print(row, column)
        if setup[row][column]["text"] != "":
            client.send(HIT.encode(FORMAT))
            setup[row][column].config(text= "X", bg="red")

        elif setup[row][column]["text"] == "":
            client.send(MISS.encode(FORMAT))
            setup[row][column].config(text= "O", bg="grey")

        turn = you
        label.config(text=you + "s tur")


def place_ships(row, column, team):
    
    #row = vilken rad
    #column = vilken kolumn
    #team = vilken spelare som kör

    #Importerar de globala variablerna som ska ändras
    global player_ships


    if player_ships > 0  and setup[row][column]["text"] == "": #Kollar så spelaren har skepp att sätta ut och trycker på en tom ruta

        player_ships -= 1  #Tar bort ett av skeppen
        label.config(text=("Du har " + str(player_ships) + " skepp kvar att sätta ut!"))
        setup[row][column].config(text="S", bg="blue")    #Ändrar rutan för att visa att skeppet är placerat


    elif player_ships >= 0 and setup[row][column]["text"] != "":    #Ifall man trycker på ett skepp så ska det tas bort

        player_ships += 1  #Lägger till en till variabeln som berättar hur många som behövs sättas ut

        label.config(text=(players[0] + " har " + str(player_ships) + " skepp kvar att sätta ut!"))    #Skriver ut hur många skepp som måste sättas ut

        setup[row][column].config(text="",bg="#F0F0F0")  #Ändrar knappen till ordinarie stadie

    #Ändrar färgen på "CONFIRM" knappen när det går att trycka
    if player_ships <= 0:
        setup_button.config(bg="green")
    else:
        setup_button.config(bg="#F0F0F0")



def check_win(player):  #Kollar ifall en spelare har vunnit genom att man har skutit alla 5 skepp

    #player = vilken spelare som ska kollas

    global points #För att kunna kolla på en global variabel

    if player == 1: #Kollar ifall spelare 1 har vunnit
        if points[0] == 5:
            return True

    elif player == 2:   #Kollar ifall spelare 2 har vunnit
        if points[1] == 5:
            return True


def confirm():  #Funktion för när man ska godkänna positionerna för skeppen
    global player_ships
    if player_ships <= 0:  #Kollar så alla skeppen är placerade

        
        setup_frame.place_forget()  #Döljer den ordinarie brädet
        setup_button.place_forget() #Tar bort "CONFIRM" knappen

        if player_ships == 0:
            player_ships -= 1 #Ser till att det inte går att ta bort skepp när man har tryckt

        gameplay_frame.place(relx= 0, rely= 1, anchor="sw")
        setup_frame.place(relx=1, rely=1, anchor="se")

        threading.Thread(target=wait_for_confirm)

        label.config(text=(players[0] + "s tur"))

        global turn
        if turn != you:
            threading.Thread(target=wait_for_move).start()


def wait_for_confirm():
    ready = "READY!"
    client.send(ready.encode(FORMAT))
    while True:
        data = client.recv(1024)
        if not data:
            client.close()
            break
        else:
            message = data.decode(FORMAT)
            if message == ready:
                break


def start_multiplayer():
    
    setup_frame.place(relx= 0, rely= 1, anchor="sw") #Vilken position brädet har

    label.config(text=(players[0] + " har " + str(player_ships) + " skepp kvar att sätta ut!"))

    setup_button.place(relx=0.5,rely=0.5,anchor="center") #Placeras ut direkt
    



#_______________________________________________________Programmet startar_____________________________________________________________________

window = Tk()   #skapar ett fönster/rot

window.title("Battle Ships")    #ger rutan en titel

#En rubrik som ändras beroende på vad som sker i spelet för att ge information om vad man ska göra etc
label = Label(text=("Välkommen till sänka skepp! Ska du joina eller hosta?"), font=("consoloas", 32))
label.place(relx=0.5, anchor="n")

#Knapparna för att välja vilket "gamemode" man vill spela
host_button = Button(window, text="Host", command=lambda : [join_button.place_forget(), host_button.place_forget(), host_game()])
host_button.place(relx=0.2,rely=0.9,anchor="w")

join_button = Button(window, text="Join", command=lambda : [join_button.place_forget(), host_button.place_forget(), join_game()])
join_button.place(relx=0.8,rely=0.9,anchor="e")

#En tom lista för knapparna att läggas in i en 5x5 storlek
setup =         [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                ]


gameplay =      [[0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                ]





#Lägger även in detta i en frame för att kunna presentera brädet och kunna ta bort och lägga till enskilda bräden
setup_frame = Frame(window)

gameplay_frame = Frame(window)

#Knapp för att godkänna postionen av skeppen

setup_button = Button(text="Confirm", font=("consoloas", 20), command=lambda: confirm())

#Loopar för att skapa knapparna till spelbrädet
#En loop för vardera av bräden
for row in range(5):

    for column in range(5):

        setup[row][column] = Button(setup_frame, text="", font=("consolas", 40), width=3, height=1, command= lambda row=row, column=column: place_ships(row, column, you))

        setup[row][column].grid(row=row,column=column)


for row in range(5):

    for column in range(5):

        gameplay[row][column] = Button(gameplay_frame, text="", font=("consolas", 40), width=3, height=1, command= lambda row=row, column=column: hit_ships(row, column))

        gameplay[row][column].grid(row=row,column=column)

window.mainloop()

#Ser till att om rutan stängs och det finns en koppling så avslutas den
if client != None:
    client.close()