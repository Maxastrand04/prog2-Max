from tkinter import *
import socket
import threading

players = ["Host", "Client"]   #En lista för att kunna ändra namnen på spelarna som kör

you = None  #Vilken spelare du är bestäms senare

turn = players[0]   #Spelare 1 börjar

player_ships = 5    # antalet skepp man ska placera ut
 
points = [0, 0]     #Poängräknare [0] = spelare 1, [1] = spelare 2, [2] = AI

#Fasta variabler för att underlätta typfel
HOST = socket.gethostbyname(socket.gethostname())
PORT = 5050
FORMAT = 'utf-8'
#Fasta meddelanden för att underlätta typfel
HIT = "hit"
MISS = "miss"
WIN = "win"

#Clienten vet vi inte från start utan det får vi reda på senare
client = None

def host_game():    #När man ska hosta så visas vilken IP-Adress som är aktuell för anslutning
    label.config(text=("Lyssnar på IP-Adress: "+ str(HOST)))
    
    #Startar en tråd för att lyssna så inte programmet fryser till och "krashar" medans man väntar
    threading.Thread(target=start_listen).start()
    
    #Bestämmer vilken spelare du är : "host"
    global you 
    you = players[0]    # Host

def start_listen(): #Funktion för att börja lyssna efter anslutning

    #globala clienten för att kunna ändra den och skicka meddelanden senare
    global client

    #skapar servern och lyssnar efter anslutningen
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((HOST, PORT))
    server.listen(1)

    #Tar emot vilken clienten är och sparar
    client, addr = server.accept()
    
    #Startar en tråd där spelet startas
    threading.Thread(target=start_multiplayer).start() 
    server.close()
    

def join_game():    #För att gå med i en server så aktiveras denna funktion
    label.config(text="Skriv in IP-addressen du vill gå med i!")

    #Ip_adress = textinmatning som skapas i funktionen men vilö kunna användas globalt
    #you = för att bestämma vilken spelare du är
    global IP_adress, you
    text = StringVar
    IP_adress = Entry(window, textvariable=text)
    IP_adress.place(relx=0.5, rely=0.5, anchor="center")
    
    #En eventlistener för att kunna trycka på enter när man har tryckt in IP-adressen
    IP_adress.bind("<Return>", connect_to_server)

    you = players[1]    #client


def connect_to_server(e):

    #Tar in global client för att kunna skicka meddelande mellan host och client
    global client

    #Hämtar vilken IP-adress man vill ansluta till
    host = e.widget.get()

    #Try för att inte programmet ska krasha vid felinmatning av IP-Adress
    try:
        #Klargör allt som krävs för clientsidan av anslutningen
        client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        client.connect((host, PORT))

        #Startar en tråd med funktion att börja spelet
        threading.Thread(target=start_multiplayer).start()
        IP_adress.place_forget()
        IP_adress.unbind("<Return>")
    except:
        #Meddelande vid fel IP-Adress
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

            #Skickar vilken ruta man skjuter och väntar och se ifall det träffar eller missar
            square = str(row) +"," + str(column)
            client.send(square.encode(FORMAT))

            data = client.recv(1024)
            if not data:    #Ser till att meddelandet inte krashar programmet
                client.close()
            else:
                hit_or_miss = data.decode(FORMAT)
                if hit_or_miss == HIT:
                    
                    gameplay[row][column].config(text= "X", bg="red")    #fyller i rutan som en träff

                    points[0] += 1  #Ger poäng till spelare 1
                else:
                    
                    gameplay[row][column].config(text="O", bg="grey")    #fyller i rutan som en miss

            if check_win() == True:
                return

            #Ändrar till motståndarens tur
            if you == players[0]:
                turn = players[1]
            else:
                turn = players[0]
            
            label.config(text=turn + "s tur")
            

            #När din tur är slut så väntar man på att motståndaren ska göra sitt drag
            threading.Thread(target=wait_for_move).start()


def wait_for_move():
    
    #Tar in turn för att kunna ändra denna globala variabel
    global turn

    #Lyssnar efter meddelandet med vilken ruta motståndaren skjuter på
    data = client.recv(1024)

    if not data:    #Ser till att meddelandet inte krashar programmet
        client.close()
    
    else:   #Kollar vilken ruta som motståndaren skjuter på och returnera ifall det är en träff eller miss
        
        #Delar upp meddelandet i "row" och "column" för att kunna implimentera senare
        row, column = data.decode(FORMAT).split(',')
        row = int(row)
        column = int(column)

        #Ifall det är en träff
        if setup[row][column]["text"] != "":
            client.send(HIT.encode(FORMAT))
            setup[row][column].config(text= "X", bg="red")

        #Ifall det är en miss
        elif setup[row][column]["text"] == "":
            client.send(MISS.encode(FORMAT))
            setup[row][column].config(text= "O", bg="grey")

        #Ändrar till din tur
        turn = you
        label.config(text=you + "s tur")

        #Kollar om motståndaren har vunnit så avslutas spelet
        check_win()


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



def check_win():  #Kollar ifall en spelare har vunnit genom att man har skutit alla 5 skepp
    
    #Kollar ifall spelare 1 har vunnit
    if points[0] == 5:
        label.config(text=(players[0] + " Vann!"))
        gameplay.place_forget()
        setup.place_forget()
        return True

    #Kollar ifall spelare 2 har vunnit
    if points[1] == 5:
        label.config(text=(players[1] + " Vann!"))
        gameplay.place_forget()
        setup.place_forget()
        return True


def confirm():  #Funktion för när man ska godkänna positionerna för skeppen
    global player_ships
    if player_ships <= 0:  #Kollar så alla skeppen är placerade

        
        setup_frame.place_forget()  #Döljer den ordinarie brädet
        setup_button.place_forget() #Tar bort "CONFIRM" knappen

        if player_ships == 0:
            player_ships -= 1 #Ser till att det inte går att ta bort skepp när man har tryckt

        #Placerar ut brädena så du kan skjuta och ser vad din motståndare skjuter

        gameplay_frame.place(relx= 0, rely= 1, anchor="sw")
        setup_frame.place(relx=1, rely=1, anchor="se")

        #Startar en tråd för att vänta på motståndaren att bli klar
        threading.Thread(target=wait_for_confirm)

        label.config(text=(players[0] + "s tur"))

        #Om du är client så börjar du med att lyssna efter drag
        global turn
        if turn != you:
            threading.Thread(target=wait_for_move).start()


def wait_for_confirm(): #Funktion som väntar på motståndaren att bli klar

    #skickar ett meddelande till den andra spelaren att man är redo
    ready = "READY!"
    client.send(ready.encode(FORMAT))
    
    #Väntar på att få ett "READY" meddelande av motståndaren
    while True:
        data = client.recv(1024)
        if not data:
            client.close()
            break
        else:
            message = data.decode(FORMAT) #Kollar så att meddelandet är ready-meddelandet
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

#Knapparna för att välja om du är host eller client
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