// inleder med att deklarera saker för canvas samt hämtar information från en annan JS fil för att inte ha listor härs

import * as pFact from './Player information.js'

let canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");

// deklarerar vaiabler som har koll på vilken bild som är aktiva
var rightImage;
var leftImage;

// variabel som räknar poäng
let scoreCount = 0;

// klassen Button är till för att göra en "higher" knapp och en "lower" knapp  
// de har samma funktioner, därmed ändras postion och färger med variabler som deklareras när de ritas ut
class Button {
    constructor(xpoint, ypoint, height, width){
        this.xpoint = xpoint;
        this.ypoint = ypoint;
        this.height = height;
        this.width = width;
    }

    // ritar ut knappen
    draw(typeOfButton){
        var xposition = this.xpoint;
        var yposition = this.ypoint;
        var button = new Image();
        button.src = `./program images/buttons/${typeOfButton}.png`;
        button.onload = function(){
            c.drawImage(button, xposition, yposition);
        }
    }
    // kollar så när canvasen blir tryckt med "click" vilket är vänster klick med musen så letar den om det var knappen som tröcks ned
    clickButton(xmouse, ymouse){
        
        // till för att trycket ska vara mera centrerad i knappen
        xmouse += 17
        ymouse -= 20
        
        // kollar mitt punkten i knappen
        let xmiddle = this.xpoint + (this.width/2)
        let ymiddle = this.ypoint + (this.height/2)

        // kollar avståndet från mitten av knappen
        var xdistance = xmouse - xmiddle
        xdistance = Math.abs(xdistance)

        var ydistance = ymouse -ymiddle
        ydistance = Math.abs(ydistance)
        
        // if statements för om man tröck i knappen 
        if (xdistance< this.width/2){
        
            if (ydistance< this.height/2){
                return true
            }
        }
    }
}


// funktion som slumpar de första två spelarna när sidan startas 
function starterfunction(x,y,image,){
    var randomNumber = Math.floor(Math.random() * pFact.playerArray.length);
    rightImage = pFact.playerArray[randomNumber] 
    
    image.src = `./player images/${rightImage}.png`;
    image.onload = function(){
        c.drawImage(image, x, y);
    }
}
// funktion för att rita ut loggan
function drawLogo(){
    var logoimg = new Image();
    logoimg.src = `./program images/Higher or lower logo.png`
    logoimg.onload = function(){
        c.drawImage(logoimg, canvas.width/2 - 141.5, 50)
    }
}

// funktion för att skriva ut "or" mellan knapparna
function orText(height){
    c.fillStyle = "white"
    c.font = "40px Arial"
    c.textAlign = "center"
    c.fillText("OR", canvas.width/2, canvas.height - height)
}

// funktion som ser till att ny bild skapas och ritas ut samt att den andra flyttar sig
function newImage(){
    c.clearRect(0,0,canvas.width,canvas.height)
    
    drawLogo();
    orText(335);

    // flyttar den högra bilden till vänster och ritar den
    leftImage = rightImage
    img1.src = `./player images/${leftImage}.png`;
    img1.onload = function(){
        
        c.drawImage(img1, 100, 100);
    }

    // ritar ut allt annat som ska synas
    c.fillStyle = "White"
    c.font = "70px Arial"
    c.textAlign = "center"

    c.fillText(`${leftImage}`, 342.5, canvas.height - 200)
    c.fillText(`${pFact.playervalue[rightImage]} 000 000 €`, 342.5 ,canvas.height - 100)
    
    lowerButton.draw("Lower button");
    higherButton.draw("Higher button");
    helpButton.draw("Help button");

    let randomNumber = Math.floor(Math.random() * pFact.playerArray.length);
    rightImage = pFact.playerArray[randomNumber]

    c.fillText(`${rightImage}`, canvas.width - 342.5, canvas.height - 200)

    img2.src = `./player images/${rightImage}.png`;

    c.fillstyle = "white"
    c.font = "30px Arial"
    c.textAlign = "center"
    c.fillText(`score: ${scoreCount}`, canvas.width - 100, canvas.height - 50)
}

function clickFunction(event){
    // Kollar vilka kordinater man trycker på och om det är innanför någon av knapparna
    const rect = canvas.getBoundingClientRect()
    const xpos = event.clientX - rect.left
    const ypos = event.clientY - rect.top

    let higher = higherButton.clickButton(xpos, ypos );
    let lower = lowerButton.clickButton(xpos, ypos );
    let help = helpButton.clickButton(xpos,ypos)
    if ( higher === true ){
        Higher()
    }
    if (lower === true ){
        Lower()
    }
    if (help === true){
        Help()
    }
}


function Higher(){
    // kollar om man gissar rätt och fortsätter spelet vid rätt gissning
    if(pFact.playervalue[leftImage] < pFact.playervalue[rightImage]){
    scoreCount += 1
    newImage();
    
    }
    else if(pFact.playervalue[leftImage] === pFact.playervalue[rightImage]){
        scoreCount += 1
        newImage();
        
    }
    else{
        c.clearRect(0,0,canvas.width,canvas.height)
        
        // ritar ut GAME OVER
        c.fillStyle = "White"
        c.font = "90px Arial"
        c.textAlign = "center"
        c.fillText("Game Over", canvas.width/2, canvas.height/2)

        c.font = "50px Arial"
        c.fillText(`Your score was: ${scoreCount}`, canvas.width/2, canvas.height/2 + 200)

        canvas.removeEventListener("click", clickFunction)

    }
}

function Lower(){
    // kollar om man gissar rätt och fortsätter spelet vid rätt gissning
    if(pFact.playervalue[leftImage] > pFact.playervalue[rightImage]){
        scoreCount += 1
        newImage();
        }
    else if(pFact.playervalue[leftImage] === pFact.playervalue[rightImage]){
        scoreCount += 1
        newImage();
    }
    else{
        c.clearRect(0,0,canvas.width,canvas.height)
        
        // ritar ut GAME OVER
        c.fillStyle = "White"
        c.font = "90px Arial"
        c.textAlign = "center"
        c.fillText("Game Over", canvas.width/2, canvas.height/2)

        c.font = "50px Arial"
        c.fillText(`Your score was: ${scoreCount}`, canvas.width/2, canvas.height/2 + 200)

        canvas.removeEventListener("click", clickFunction)

    }
}

// funktion för hjälp knappen i programmet
function Help(){
    // ritar ut hjälprutan
    var helpImage = new Image()
    helpImage.src = "./program images/Help image.png"
    helpImage.onload = function(){
        
        c.drawImage(helpImage, canvas.width/2 - 500, canvas.height/2 - 400);
    }
    // timeouten är till för att knappen inte ska ritas ut före rutan och hamna bakom
    setTimeout(() => {  closeButton.draw("Close button"); }, 5);

    // gör så att de andra knapparna blir urkopplade medans hjälprutan är uppe
    canvas.addEventListener("click", Closefunction)
    canvas.removeEventListener("click", clickFunction)
}

// funktion för att stänga ned hjälp rutan
function Closefunction(event){
    const rect = canvas.getBoundingClientRect()
    const xpos = event.clientX - rect.left
    const ypos = event.clientY - rect.top
    
    var close = closeButton.clickButton(xpos,ypos)
    if (close === true){
        // tar bort allt och ritar allt som ska vara med i början
        c.clearRect(0,0,canvas.width, canvas.height)

        drawLogo();
        lowerButton.draw("Lower button")
        higherButton.draw("Higher button")
        helpButton.draw("Help button")
        orText(335)

        
        c.fillStyle = "White"
        c.font = "70px Arial"
        c.textAlign = "center"

        //leftImage = rightImage
        img1.src = `./player images/${leftImage}.png`
        img1.onload = function(){
        
            c.drawImage(img1, 100, 100);
        }    
        c.fillText(`${pFact.playervalue[leftImage]} 000 000 €`, 342.5 ,canvas.height - 100)
        c.fillText(`${leftImage}`, 342.5, canvas.height - 200)

        img2.src =`./player images/${rightImage}.png`
        img2.onload = function(){
        
            c.drawImage(img2, canvas.width - 585, 100);
        }
    
        c.fillText(`${rightImage}`, canvas.width - 342.5, canvas.height - 200)
        console.log(pFact.playervalue[leftImage], pFact.playervalue[rightImage])

        c.fillstyle = "white"
        c.font = "30px Arial"
        c.textAlign = "center"
        c.fillText(`score: ${scoreCount}`, canvas.width - 100, canvas.height - 50)

        // tar bort stäng knappens eventlistener samt ser till att de andra knapparna fungerar
        canvas.removeEventListener("click", Closefunction)
        canvas.addEventListener("click", clickFunction)

    }
}


//---------------------------------------------------Programmet startar-----------------------------------------------------

// ritar ut higher/lower loggan
drawLogo();

// skapar bildvariabel 1 (vänstra bilden)
var img1 = new Image();

// skapar bildvariabel 2 (högra bilden)
var img2 = new Image();

// skapar knapparna och ritar ut de i programmet
const lowerButton = new Button(canvas.width/2 - 100, canvas.height - 300, 200, 200) 
lowerButton.draw("Lower button");

const higherButton = new Button(canvas.width/2 - 100, canvas.height - 600, 200, 200)
higherButton.draw("Higher button");

// knappen för hjälprutan
const helpButton = new Button(canvas.width-120, 20, 80, 101)
helpButton.draw("Help button")

// knappen för att stänga hjälprutan
const closeButton = new Button(canvas.width/2 - 50, 760, 50, 100)

// ritar ut "or" texten mellan knapparna
orText(335)

// ritar första bilden och skriver ut dess värde
starterfunction(100, 100, img1)
c.fillStyle = "White"
c.font = "70px Arial"
c.textAlign = "center"

leftImage = rightImage

c.fillText(`${pFact.playervalue[leftImage]} 000 000 €`, 342.5 ,canvas.height - 100)
c.fillText(`${leftImage}`, 342.5, canvas.height - 200)

// ritar andra bilden
starterfunction(canvas.width - 585, 100, img2)
c.fillText(`${rightImage}`, canvas.width - 342.5, canvas.height - 200)
console.log(pFact.playervalue[leftImage], pFact.playervalue[rightImage])

c.fillstyle = "white"
c.font = "30px Arial"
c.textAlign = "center"
c.fillText(`score: ${scoreCount}`, canvas.width - 100, canvas.height - 50)


// letar efter knapptryck och kör därefter en av funktionerna
canvas.addEventListener("click", clickFunction) 