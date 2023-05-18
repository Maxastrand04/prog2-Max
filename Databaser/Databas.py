import tkinter as tk    # Importerar tkinter för att använda ett gränssnitt
from tkinter import ttk # Importerar treeview objektet så att man kan göra listan med reservationer
import threading


import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",  # standardanvändarnamn för XAMPP
  password="",  # dito lösenord (en tom sträng)
  database="reservationer restaurang"  # byt namn om din databas heter något annat
)


cursor = mydb.cursor()

# Query som används när man ska lägga till data till databasen
query = "INSERT INTO reservationer (Id, Efternamn, Tid, Antal, Veckodag) VALUES (%s, %s, %s, %s, %s)"

# Query som letar upp data med specifikt id och tar bort den
delete_query = "DELETE FROM reservationer WHERE Id = %s"

# Query för att uppdatera en existerande reservation
update_query = "UPDATE reservationer SET Efternamn = %s, Tid = %s, Antal = %s, Veckodag = %s WHERE Id = %s"

get_reservations = "SELECT Id, Efternamn, Tid, Antal, Veckodag FROM reservationer"
cursor.execute(get_reservations)

window = tk.Tk()
window.title("Reservation")

# Skapar en lista med 5 kolumner 
treeview = ttk.Treeview(window, columns=("column1", "column2", "column3", "column4", "column5"))

# Kolumn rubriker
treeview.heading("column1", text="ID")
treeview.heading("column2", text="Namn")
treeview.heading("column3", text="Tid")
treeview.heading("column4", text="Antal")
treeview.heading("column5", text="Veckodag")


# Döljer namnkolumnen som annars finns längs till vänster
treeview.column("#0", width=0)

# Fetch data från databasen
rows = cursor.fetchall()

# Lägger till de "Fetchade" raderna till listan
for row in rows:
    treeview.insert("", tk.END, values=row)

treeview.column("column1", width=20)
treeview.column("column2", width=150)
treeview.column("column3", width=80)
treeview.column("column4", width=50)
treeview.column("column5", width=90)

treeview.place(relx=0.6, rely=0.3)

label = tk.Label(text=("Boka bord på Restaurant Á la Max"), font=("consoloas", 32))
label.place(relx=0.5, anchor="n")

weekday_list = ["   Välj veckodag     ","Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"] #Lista med de valbara dagarna
time_list =    ["      Välj tid       ", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"] #Lista med de valbara tiderna
amount_list =  ["välj antal i sällskap", "1", "2", "3", "4", "5", "6"] #Lista med de valbara sällskapsstorlekarna

selected_day = tk.StringVar()
selected_day.set(weekday_list[0]) # Variabel som sparar vilken dag man har valt

selected_time = tk.StringVar()
selected_time.set(time_list[0]) # Variabel som sparar vilken tid man har valt

selected_amount = tk.StringVar()
selected_amount.set(amount_list[0]) # Variabel som sparar hur stort sällskap man har valt

# Rullgardinsmeny med alla valen av dagar
weekday_menu = tk.OptionMenu(window, selected_day, *weekday_list)
weekday_menu.place(relx=0.1, rely=0.4)

# Rullgardinsmeny med alla valen av tider
time_menu = tk.OptionMenu(window, selected_time, *time_list)
time_menu.place(relx=0.1, rely=0.5)

# Rullgardinsmeny med alla val av sällskapsstorlekar
amount_menu = tk.OptionMenu(window, selected_amount, *amount_list)
amount_menu.place(relx=0.1,rely=0.6)

# Input på vilket efternamn reservationen ska vara

default_text = "T ex Andersson"

input_name = tk.Entry(window, fg="grey", width=30)
input_name.insert(0, default_text)
input_name.place(relx=0.1, rely=0.3)

# Namnet är från början utan värde
name = None


def get_values():
    global selected_amount, selected_time, selected_day, name

    time = selected_time.get()
    if time == time_list[0]:
        return False
    
    companySize = selected_amount.get()
    if companySize == amount_list[0]:
        return False
    
    weekday = selected_day.get()
    if weekday == weekday_list[0]:
        return False
    
    # Får varken vara default_text eller tom sträng
    name = input_name.get()
    if name == default_text or name == "":
        return False
    
    values = [name, time, companySize, weekday]
    return values

def get_db_values():
    # Hämtar alla reservationer
    cursor.execute("SELECT Id, Efternamn, Tid, Antal, Veckodag FROM reservationer")
    
    rows = cursor.fetchall()

    # Tar bort alla reservationer för att uppdatera listan med den senast uppdaterade databasen
    for item in treeview.get_children():
        treeview.delete(item)

    for row in rows:
        treeview.insert("", tk.END, values=row)


def clear_alternatives():
    # Nollar alla inställningar för att man ska börja om
    selected_time.set(time_list[0])
    selected_amount.set(amount_list[0])
    selected_day.set(weekday_list[0])
    input_name.delete(0, "end")

# tar bort standardtexten när man trycker på rutan
def on_click(event):
    if input_name.get() == default_text:
        input_name.delete(0, "end")
        input_name.config(fg="black")


# Sparar reservationen och lägger till i både databasen och tkinter listan
def save_reservation():

    if get_values() == False:
        return
    else:
        values = get_values()

    # Bestämmer vilket id den nya reservationen ska ha genom att kolla vad den sista reservationen har för id och öka med ett
    try:
        last_item = treeview.get_children()[-1]
        values = treeview.item(last_item, 'values')
        id = int(values[0]) + 1

    except:     # Om det inte finns någon reservation får den id nummer 1
        id = 1
    
    # values[0] = namn, values[1] = tid, values[2] = antal, values[3] = veckodag
    values = (id, values[0], values[1], values[2], values[3])

    cursor.execute(query, values)

    mydb.commit()

    # Uppdaterar listan
    get_db_values()

    # Nollställer alternativen
    clear_alternatives()


# Funktion som tar bort en reservation från listan och databasen
def delete_object(event):

    selected_item = treeview.focus()
    if selected_item:

        values = treeview.item(selected_item, 'values')
        deleted_item = values[0]
        
        treeview.delete(selected_item)
        cursor.execute(delete_query, (deleted_item,))
        mydb.commit()

# Funktion för att ändra ett objekt och lägger till alla dess alternativ till valen av parametrar
def edit_object(event):

    global current_id

    selected_item = treeview.focus()
    values = treeview.item(selected_item, 'values')

    #Sparar id:et för att veta vilken reservation som ska ändras
    current_id = values[0]

    input_name.delete(0, "end")
    input_name.config(fg="black")
    input_name.insert(0, values[1])

    selected_time.set(values[2])
    selected_amount.set(values[3])
    selected_day.set(values[4])

    # Tar bort reservationen från listan men INTE databasen
    treeview.delete(selected_item)

    def wait_for_confirmation():
        if get_values() == False:
            return
        else:
            values = get_values()
        
        cursor.execute(update_query, (values[0], values[1], values[2], values[3], current_id))

        mydb.commit()

        # Uppdaterar listan
        get_db_values()

        # nollställer alternativen
        clear_alternatives()

        # Ändrar tillbaka så vid nästa gång man sparar reservationen så är det en ny och försöker inte ändra en redan existerande
        save_button.config(command=save_reservation)

    # Ändrar så istället för att spara reservationen som ny så uppdaterar den en redan existerande reservation 
    save_button.config(command=wait_for_confirmation)

    return current_id

# Lyssnar på att användaren trycker på boxen för efternamn
input_name.bind("<FocusIn>", on_click)

treeview.bind("<BackSpace>", delete_object)
treeview.bind("<Return>", edit_object)

save_button = tk.Button(text=("Spara bokning"), font=("consoloas", 12), command=save_reservation)
save_button.place(relx=0.3, rely=0.5)


window.mainloop()

#Stänger ner kopplingen när programmet dödas
cursor.close()
mydb.close()