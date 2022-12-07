import tkinter as tk

root = tk.Tk()

def myFunction(self):
    frame["bg"] = "#263D42"
    frame.place


canvas = tk.Canvas(root, height=500, width=500, bg="#263D42")
canvas.pack()

frame = tk.Frame(root, bg="white")
frame.place(relwidth=0.8, relheight=0.8, relx=0.1, rely=0.1)

Higher = tk.Button(root, text="Higher", padx=10, pady=5, fg="white", bg="#263D42")

Higher.pack()

Lower = tk.Button(root, text="Lower", padx=10, pady=5, fg="white", bg="#263D42")

Lower.pack()

Higher.bind("<Button-1>", myFunction)
Lower.bind("<Button-2>", myFunction)


root.mainloop()