const Form = document.querySelector("[step-of-program]")
const step1 = document.getElementById("step1")
const step2 = document.getElementById("step2")
const formButton = document.getElementById("form-send")
const inviteButton = document.getElementById("invite")
const board = document.getElementById("board")

let draggedItem
let startSquare
let starty = 0
let startx = 0

let piecesArray = []
let squareArray = []

import {kingMove, queenMove, bishopMove, knightMove, rookMove, pawnMove} from './rules.js'  //importerar reglerna från en annan fil


step1.style.display = "block"


Form.addEventListener("click", e => {
    if (e.target === formButton){
        step2.style.display = "block"
        step1.style.display = "none"
    }
})

step2.addEventListener("click", e =>{
  if (e.target === inviteButton){
    step2.style.display = "none"
    step1.style.display = "block"
  }
}
)

//Skapar brädet
function createBoard() {

    //Skapar raderna med olika y-koordinater
    for(let y=0; y < 8; y++){

        let boardLines = document.createElement("div")
        boardLines.className = "boardLines"
        boardLines.id = `line ${y}`
        
        //Skapar 8 rutor för varje rad
        for(let x=0; x<8; x++){

            let square = document.createElement("div")
            square.id = `square ${y} ${x}`
            
            //Kollar ifall det ska vara en vit eller brun ruta för att färgen ska ändras under "style.css"
            if((x+y) % 2 == 0){
                square.className = "whiteSquare"
            }else {
                square.className = "brownSquare"
            }

            //Lägger till rutan i raden och i en array för att kunna lägga till eventlisteners till varje ruta
            squareArray.push(square)
            boardLines.appendChild(square)
        }
        //Lägger till raderna till brädet
        board.appendChild(boardLines)
    }
}

//Funktion för att skapa en pjäs och placera den i sin start ruta
function addPiece(y, x, typeOfPiece, side){

  //y = rad
  //x = column
  //typeOfPiece = vilken pjäs
  //side = vilket lag

  const choosenSquare = document.getElementById(`square ${y} ${x}`)

  let piece = document.createElement("img")
  piece.id = `${typeOfPiece}`
  piece.src = `images/${side} pieces/${side} ${typeOfPiece}.png`
  piece.className =`piece ${side}`
  piece.draggable = "true"

  //Ser till att flytta pjäsen in i vald ruta
  piece.ondragend = function(){
    
  }
  piecesArray.push(piece)
  choosenSquare.appendChild(piece)
  
}



createBoard()


// placerar ut alla svarta pjäser
addPiece(0,0,"rook", "black")
addPiece(0,1,"knight", "black")
addPiece(0,2,"bishop", "black")
addPiece(0,3,"queen", "black")
addPiece(0,4,"king", "black")
addPiece(0,5,"bishop","black")
addPiece(0,6,"knight", "black")
addPiece(0,7,"rook", "black")
//loopar igenom en hel rad med bönder
for( let i = 0; i < 8; i++){
  addPiece(1,i,"pawn", "black")
}


// placerar ut alla vita pjäser
addPiece(7,0,"rook", "white")
addPiece(7,1,"knight", "white")
addPiece(7,2,"bishop", "white")
addPiece(7,3,"queen", "white")
addPiece(7,4,"king", "white")
addPiece(7,5,"bishop","white")
addPiece(7,6,"knight", "white")
addPiece(7,7,"rook", "white")
//loopar igenom en hel rad med bönder
for( let i = 0; i < 8; i++){
  addPiece(6,i,"pawn", "white")
}


for (let i = 0; i < piecesArray.length; i++){
  const item = piecesArray[i]
  
  //Ser till att spara vilket objekt som har förflyttats i variabeln "draggedItem" för att kunna förflytta till en annan ruta
  item.addEventListener("dragstart", function(e){
    draggedItem = this
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);

    //Ger koordinaterna på rutan den plockas från
    startSquare = this.parentNode.id
    let stringToArray = startSquare.split(" ")
    starty = stringToArray[1]
    startx = stringToArray[2]

    //Gör pjäsen osynlig under förflyttning för att ge illusionen att man plockar upp pjäsen
    setTimeout(function(){
      item.style.display = "none"
    }, 0)

  })

  //Gör pjäsen synlig igen när den är släppt
  item.addEventListener("dragend", function(){

    setTimeout(function(){
      draggedItem.style.display = "block"
    }, 0)
  
  })
}
for (let j = 0; j < squareArray.length; j++){
  const square = squareArray[j]

  //Ser till att sidan inte gör sitt defaultbehandling vid "drag and drop" 
  square.addEventListener("dragover", function(e){
    e.preventDefault()
  })

  square.addEventListener("drop", function(e){
    
    this.append(draggedItem)
    let endSquare = square.id

      //Om en förflyttning har skett och man inte släpper pjäsen i startrutan
      if (startSquare !== endSquare){
        let stringToArray = endSquare.split(" ")
          
        let endy = stringToArray[1] //får fram y-koordinaten
        let endx = stringToArray[2] //får fram x-koordinaten

        lookForCheck(0,endx,endy, "black")

        setTimeout( function(){

          let children = Array.from(square.children)

          //Tar ur den sista tillagda pjäsen och kollar om förflyttningen var godkänd
          let movedPiece = children.pop()
          let moveCheck

          let checkClearWay = checkObstacles(startx, starty, endx, endy, movedPiece)

          if (checkClearWay === false){
            let returnToSquare = document.getElementById(startSquare)
            returnToSquare.append(draggedItem)
            return
          }

          //Kollar ifall pjäsen är en bonde för att den kräver andra parametrar
          if (movedPiece.id == "pawn"){

            //Antar att pjäsen INTE dödar någon och kollar ifall den gör i if-satsen
            let kill = false

            //kollar om pjäsen tar en annan för att använda andra regler
            if (children.length > 0){
              kill = true
            }

            //Kollar om bonden har flyttats tidigare för att kunna tillåta dubbelsteg
            let pawnsThatAreMoved = [...document.getElementsByClassName("moved")]
            let firstMove = true
            if (pawnsThatAreMoved.includes(movedPiece)){
              firstMove = false
            }

            //Kollar vilken sida bonden tillhör för att se till att den kan förflyttas åt rätt håll
            let team = movedPiece.className
            let stringToArray = team.split(" ")
            team = stringToArray[1]

            moveCheck = pawnMove(startx, starty, endx, endy, kill, team, firstMove)
            if (moveCheck === true){
              movedPiece.className += " moved"
            }
          }

          //När andra pjäser förflyttas så används denna istället
          else{
            moveCheck = eval(`${movedPiece.id}Move(${startx}, ${starty}, ${endx}, ${endy})`)
            
          }

          //Ifall förflyttningen inte är enligt reglerna så skickas pjäsen till sin ordinarie plats
          if (moveCheck !== true){

            let returnToSquare = document.getElementById(startSquare)
            returnToSquare.append(draggedItem)

          } 
          
          //Ser till att den första pjäsen som var i rutan blir borttagen
          else {
            if (children.length >= 1){
              let movedPieceClass = movedPiece.className
              movedPieceClass = movedPieceClass.split(" ")
              let movedPieceTeam = movedPieceClass[1]

              let childrenPiece = children[0]
              let childrenPieceClass = childrenPiece.className
              childrenPieceClass = childrenPieceClass.split(" ")
              let childrenPieceTeam = childrenPieceClass[1]

              if (movedPieceTeam !== childrenPieceTeam){
                square.removeChild(square.firstElementChild)
              }
              else {
                let returnToSquare = document.getElementById(startSquare)
                returnToSquare.append(draggedItem)
              }
            }
          }  
        }, 0)
      }
    }
  )
}

export function checkObstacles(startx, starty, endx, endy, team){
  
  //Antar att vägen är ledig och ändrar värdet till "false" om detta inte stämmer
  let emptyLine = true

  let check = false

  //Förflyttning vertikalt
  if (startx === endx){
    //Om man rör sig åt negativ riktning
    if (starty > endy){
      for (let y=starty; y > endy; y--){
        let square = document.getElementById(`square ${y} ${startx}`)
        let children = Array.from(square.children)
        if (children.length > 0){
          emptyLine = false
        }
      }
    }
    //Om man rör sig åt positiv riktning
    if (starty < endy){
      for (let y=starty; y < endy; y++){
        let square = document.getElementById(`square ${y} ${startx}`)
        let children = Array.from(square.children)
        if (children.length > 0){
          emptyLine = false
        }
      }
    }
  }
  //Förflyttning horizontellt
  if (starty === endy){
    if (startx > endx){
      for (let x=startx; x > endx; x--){
        let square = document.getElementById(`square ${starty} ${x}`)
        let children = Array.from(square.children)
        if (children.length > 0){
          emptyLine = false
        }
      }
    }
    if (startx < endx){
      for (let x=startx; x < endx; x++){
        let square = document.getElementById(`square ${starty} ${x}`)
        let children = Array.from(square.children)
        if (children.length > 0){
          emptyLine = false
        }
      }
    }
  }

  if (Math.abs(startx-endx) === Math.abs(starty-endy)){
    console.log("sui")

  }

  return emptyLine
}

function lookForCheck (piecetype, opponentx, opponenty, team){
  
  //Börjar med att anta att det är shack och om en rutan är blockerad ivägen så blir check = false
  let check = true

  //[0] = svarta kungen, [1] = vita kungen
  let kingarray = [...king]

  if (team === "black"){
    let blackKing = kingarray[0]
    let blackKingSquare = blackKing.parentNode.id
    blackKingSquare = blackKingSquare.split(" ")
    
    let kingx = blackKingSquare[2]
    let kingy = blackKingSquare[1]

    if (opponentx === kingx){
      if ( opponenty > kingy){
        for (let y=opponenty-1; y > kingy; y--){
          let square = document.getElementById(`square ${y} ${opponentx}`)
          let children = Array.from(square.children)
          if (children.length > 0){
            check = false
            return
          }
        }
      }
      if ( opponenty < kingy){
        for (let y=opponenty+1; y > kingy; y++){
          let square = document.getElementById(`square ${y} ${oppponentx}`)
          let children = Array.from(square.children)
          if (children.length > 0){
            check = false
            return
          }
        }
      }
    }
    if (opponenty === kingy){
      if ( opponentx > kingx){
        for (let x=oppponentx-1; x > kingx; x--){
          let square = document.getElementById(`square ${opponenty} ${x}`)
          let children = Array.from(square.children)
          if (children.length > 0){
            check = false
            return
          }
        }
      }
      if ( opponentx < kingx){
        for (let x=oppponentx+1; x > kingx; x++){
          let square = document.getElementById(`square ${opponenty} ${x}`)
          let children = Array.from(square.children)
          if (children.length > 0){
            check = false
            return
          }
        }
      }
    }
  }
}