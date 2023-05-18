const Form = document.querySelector('[step-of-program]')
const IP_Page = document.getElementById('IP-Address-page')
const Gameplay = document.getElementById('Gameplay')
const closeButton = document.getElementById('close')
const getIPButton = document.getElementById('getIP')
const board = document.getElementById('board')
const IPAddress = document.getElementById('IP-Address')

let draggedItem
let startSquare
let starty = 0
let startx = 0

let piecesArray = []
let squareArray = []

import {kingMove, queenMove, bishopMove, knightMove, rookMove, pawnMove, typeOfMove} from './rules.js'  // Importerar reglerna från en annan fil


Gameplay.style.display = 'block'

const socket = io()

let player 

let socketID

socket.on('connect', ()=>{
  
  socketID = `${socket.id}`
  return socketID
})

socket.on('type-of-player', (clientArray) =>{
   
  if (socketID == clientArray[0]){ 
    player = 'white' 
  }

  else if (socketID == clientArray[1]){ 
    player = 'black'
    
    let children = Array.from(board.children)
    children.reverse()
    
    for (let i = 0; i < children.length; i++) {
      board.appendChild(children[i]);

      let boardline_children = Array.from(children[i].children)
      boardline_children.reverse()

      for (let x = 0; x < boardline_children.length; x++) {
        children[i].appendChild(boardline_children[x])
      }
    }

  }
  console.log(player)
})

socket.on('Get-server-IP', ServerIP =>{

  ServerIP = `${ServerIP}`

  IPAddress.innerHTML = ServerIP
  IPAddress.setAttribute("data-clipboard-text", ServerIP)
})

Form.addEventListener('click', e => {
    if (e.target === closeButton){
        Gameplay.style.display = 'block'
        IP_Page.style.display = 'none'
    }
})

Gameplay.addEventListener('click', e =>{
  if (e.target === getIPButton){
    Gameplay.style.display = 'none'
    IP_Page.style.display = 'block'
  }
}
)

//Kopierar IP-adressen till "Clipboard" för att kunna skicka till den andra spelaren
IPAddress.addEventListener('click', function() {

  let textToCopy = IPAddress.getAttribute('data-clipboard-text')

  navigator.clipboard.writeText(textToCopy)
})

// Skapar brädet
function createBoard() {

    // Skapar raderna med olika y-koordinater
    for(let y=0; y < 8; y++){

        let boardLines = document.createElement('div')
        boardLines.className = 'boardLines'
        boardLines.id = `line ${y}`
        
        // Skapar 8 rutor för varje rad
        for(let x=0; x<8; x++){

            let square = document.createElement('div')
            square.id = `square ${y} ${x}`
            
            // Kollar ifall det ska vara en vit eller brun ruta för att färgen ska ändras under 'style.css'
            if((x+y) % 2 == 0){
                square.className = 'whiteSquare'
            }else {
                square.className = 'brownSquare'
            }

            // Lägger till rutan i raden och i en array för att kunna lägga till eventlisteners till varje ruta
            squareArray.push(square)
            boardLines.appendChild(square)
        }
        // Lägger till raderna till brädet
        board.appendChild(boardLines)
    }
}

// Funktion för att skapa en pjäs och placera den i sin start ruta
function addPiece(y, x, typeOfPiece, side){

  // y = rad
  // x = column
  // TypeOfPiece = vilken pjäs
  // Side = vilket lag

  const choosenSquare = document.getElementById(`square ${y} ${x}`)

  let piece = document.createElement('img')
  piece.id = `${typeOfPiece}`
  piece.src = `images/${side} pieces/${side} ${typeOfPiece}.png`
  piece.className =`piece ${side}`
  piece.draggable = 'true'

  // Ser till att flytta pjäsen in i vald ruta
  piece.ondragend = function(){
    
  }
  piecesArray.push(piece)
  choosenSquare.appendChild(piece)
  
}



createBoard()


// Placerar ut alla svarta pjäser
addPiece(0,0,'rook', 'black')
addPiece(0,1,'knight', 'black')
addPiece(0,2,'bishop', 'black')
addPiece(0,3,'queen', 'black')
addPiece(0,4,'king', 'black')
addPiece(0,5,'bishop','black')
addPiece(0,6,'knight', 'black')
addPiece(0,7,'rook', 'black')
// Loopar igenom en hel rad med bönder
for( let i = 0; i < 8; i++){
  addPiece(1,i,'pawn', 'black')
}


// placerar ut alla vita pjäser
addPiece(7,0,'rook', 'white')
addPiece(7,1,'knight', 'white')
addPiece(7,2,'bishop', 'white')
addPiece(7,3,'queen', 'white')
addPiece(7,4,'king', 'white')
addPiece(7,5,'bishop','white')
addPiece(7,6,'knight', 'white')
addPiece(7,7,'rook', 'white')
// Loopar igenom en hel rad med bönder
for( let i = 0; i < 8; i++){
  addPiece(6,i,'pawn', 'white')
}


for (let i = 0; i < piecesArray.length; i++){
  const item = piecesArray[i]
  
  // Ser till att spara vilket objekt som har förflyttats i variabeln 'draggedItem' för att kunna förflytta till en annan ruta
  item.addEventListener('dragstart', function(e){
    draggedItem = this
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);

    // Ger koordinaterna på rutan den plockas från
    startSquare = this.parentNode.id
    let stringToArray = startSquare.split(' ')
    starty = stringToArray[1]
    startx = stringToArray[2]

    // Gör pjäsen osynlig under förflyttning för att ge illusionen att man plockar upp pjäsen
    setTimeout(function(){
      item.style.display = 'none'
    }, 0)

  })

  // Gör pjäsen synlig igen när den är släppt
  item.addEventListener('dragend', function(){

    setTimeout(function(){
      draggedItem.style.display = 'block'
    }, 0)
  
  })
}
for (let j = 0; j < squareArray.length; j++){
  const square = squareArray[j]

  // Ser till att sidan inte gör sitt defaultbehandling vid "drag and drop" 
  square.addEventListener('dragover', function(e){
    e.preventDefault()
  })

  /*  Allt som sker i "addeventListener('drop')" funktionen är att kolla alla regler
      för att se ifall något regelbrott har gjorts under förflyttningen */ 
  square.addEventListener('drop', function(e){
    
    
    this.append(draggedItem)
    let endSquare = square.id

      // Om en förflyttning har skett och man inte släpper pjäsen i startrutan
      if (startSquare !== endSquare){
        let stringToArray = endSquare.split(' ')
          
        let endy = stringToArray[1] // Får fram y-koordinaten
        let endx = stringToArray[2] // Får fram x-koordinaten



        setTimeout( function(){

          /* Tar fram en array med alla pjäser som finns på en specifik ruta 
          för att se om förflyttning var godkänd eller inte och därmed bestämma vad som ska göras */
          let children = Array.from(square.children)

          // En variabel som ändras ifall man landar på samma ruta som en motståndares pjäs
          let takenPiece = false

          // Tar ur den sista tillagda pjäsen och kollar om förflyttningen var godkänd
          let movedPiece = children.pop()
          let moveCheck

          // Får fram vilken färg pjäsen har genom att kolla vilken klass den tillhör
          let team = movedPiece.className
          let stringToArray = team.split(' ')
          team = stringToArray[1]

          let checkcheck = lookForCheck(movedPiece.id, endx, endy, team)
          console.log(checkcheck)

          // En allmän funcktion som returner det flyttade objektet till sin ordinarie plats ifall förflyttningen inte är godkänd
          function returnToSquareFunction(){
          
            let returnToSquare = document.getElementById(startSquare)
            returnToSquare.append(draggedItem)
          
          }

          // Om du flyttar motståndarens pjäs istället för din egen
          if (team !== player){
          
            returnToSquareFunction()
            return
          
          }

          // Kollar om någon pjäs är ivägen
          let checkClearWay = checkObstacles(startx, starty, endx, endy)

          // Ifall förflyttningen går igenom pjäser som är ivägen
          if (checkClearWay === false){
          
            returnToSquareFunction()
            return
          
          }

          // Kollar ifall pjäsen är en bonde för att den kräver andra parametrar
          if (movedPiece.id == 'pawn'){

            // Antar att pjäsen INTE dödar någon och kollar ifall den gör i if-satsen
            let kill = false

            // Kollar om pjäsen tar en annan för att använda andra regler
            if (children.length > 0){
            
              kill = true
            
            }

            // Kollar om bonden har flyttats tidigare för att kunna tillåta dubbelsteg
            let pawnsThatAreMoved = [...document.getElementsByClassName('moved')]
            let firstMove = true
          
            if (pawnsThatAreMoved.includes(movedPiece)){
          
              firstMove = false
          
            }

            // Kollar vilken sida bonden tillhör för att se till att den kan förflyttas åt rätt håll
            let team = movedPiece.className
            let stringToArray = team.split(' ')
            team = stringToArray[1]

            moveCheck = pawnMove(startx, starty, endx, endy, kill, team, firstMove)
            
            if (moveCheck === true){
            
              movedPiece.className += ' moved'
            
            }
          }

          else if (movedPiece.id == 'king'){

            let movedPieces = [...document.getElementsByClassName('moved')]
            let shortCastleAllowed = true
            let longCastleAllowed = true

            if (movedPieces.includes(movedPiece)){

              shortCastleAllowed = false
              longCastleAllowed = false

            }

            const shortCastleSquare = document.getElementById(`square ${starty} 7`)
            const longCastleSquare = document.getElementById(`square ${starty} 0`)

            const castleArray = [shortCastleSquare, longCastleSquare]

            for (let i = 0; i < castleArray.length; i++){

              let castleAllowed = true

              // Om det finns en pjäs i tornets ruta så kollar den vidare ifall man får göra en rokad
              if (castleArray[i].children.length > 0){
                const rook = Array.from(castleArray[i].children).pop()

                // Om pjäsen som är i rutan inte är ett torn så får man inte göra rokad
                if (rook.id != 'rook'){
                  console.log('notrook')
                  castleAllowed = false
                }

                //Om tornet är flyttat så får man inte göra rokad
                if (rook.className == ' moved'){
                  console.log('moved')
                  castleAllowed = false
                }
              }
              // Om rutan är tom så får man inte göra en rokad
              else {
                console.log('nopiece')
                castleAllowed = false
              }

              if (i === 0 && castleAllowed === false){
                shortCastleAllowed = false
              }
              else if( castleAllowed === false){
                longCastleAllowed = false
              } 
            }

            // Vanlig check function för att kolla den korta rokaden
            let shortCastleObstacleCheck = horizontalCheckFunction(startx, starty, 6)

            if (shortCastleObstacleCheck == false){
              shortCastleAllowed = false
            }
            
            // Vid den längre så krävs en specialare för att kungen inte ska blockera checken och ge ett falskt false
            const longCastlesquaresToCheck = [`square ${starty} 3`, `square${starty} 2`, `square ${starty} 1`]
            
            for (let i = 0; i< longCastlesquaresToCheck; i++){
  
              let square = document.getElementById(longCastlesquaresToCheck[i])
              let children = Array.from(square.children)
          
              if (i !== 1){
                if (children.length > 0){
          
                  longCastleAllowed = false
            
                }
              }
              else {
                if (children.length > 1){

                  longCastleAllowed = false

                }
              }
            }

            moveCheck = kingMove(startx, starty, endx, endy, shortCastleAllowed, longCastleAllowed)

            if (moveCheck === 'shortCastleAllowed'){
              const endRookSquare = document.getElementById(`square ${starty} 5`)
              const rook = Array.from(shortCastleSquare.children).pop()
              endRookSquare.append(rook)
            }
            if (moveCheck === 'longCastleAllowed'){
              const endRookSquare = document.getElementById(`square ${starty} 3`)
              const rook = Array.from(longCastleSquare.children).pop()
              endRookSquare.append(rook)
            }
            else if (moveCheck === false){
              returnToSquareFunction()
              return
            }

          }

          // När andra pjäser förflyttas så används denna istället
          else{
            moveCheck = eval(`${movedPiece.id}Move(${startx}, ${starty}, ${endx}, ${endy})`)
          }

          /* För alla pjäser förutom kungen så kan movecheck endast returnera true eller false.
          Därför kommer detta ignoreras ifall det är kungen som flyttas då dens check sker tidigare*/
          if (movedPiece.id !== 'king'){
            
            // Ifall förflyttningen inte är enligt reglerna så skickas pjäsen till sin ordinarie plats
            if (moveCheck !== true){

              returnToSquareFunction()
              return

            }
            // Ser till att den första pjäsen som var i rutan blir borttagen
            else { 

              if (children.length >= 1){

                // Kollar vilken färg den flyttade pjäsen har
                let movedPieceClass = movedPiece.className
                movedPieceClass = movedPieceClass.split(' ')
                let movedPieceTeam = movedPieceClass[1]

                // Kollar vilken färg pjäsen som var på den rutan innan förflyttningen har 
                let childrenPiece = children[0]
                let childrenPieceClass = childrenPiece.className
                childrenPieceClass = childrenPieceClass.split(' ')
                let childrenPieceTeam = childrenPieceClass[1]

                // Är det är samma lag så skickas den flyttade pjäsen tillbaka
                if (movedPieceTeam === childrenPieceTeam){

                  returnToSquareFunction()
                  return
                
                }
                //Sparar variabeln som true för att kunna ta bort pjäsen ifall inga andra regelbrott har gjorts
                else {
                  takenPiece = true
                }


              }
            }
          } 

          //Kollar så det är din tur
          socket.emit('move', startx, starty, endx, endy, team)

          socket.on('turn-check', (yourTurn) => {
            
            //Ifall det är din tur
            if (yourTurn == true){

              //Ifall du tar ut en motståndares pjäs så ska den tas bort
              if (takenPiece == true){

                square.removeChild(square.firstElementChild)
              
              }
            }
        
            //Ifall det INTE är din tur så skickas pjäsen tillbaka till sin ordinarie ruta
            else {
          
            returnToSquareFunction()
            return
        
            }

            // Behöver spara ifall pjäserna har flyttats ifall en framtida rokad vill göras
            if (movedPiece.id === 'rook' || movedPiece.id === 'king'){

              movedPiece.className += ' moved'

            }
          })

        }, 0)
      }
    }
  )
}

/* Tre olika funktioner för att kolla hinder ivägen för förflyttningar horisontellt, vertikalt och diagonalt
 Dessa funktioner används vid två olika tillfällen
 1: Vid förflyttning se ifall man hoppar förbi motståndare
 2: Kollar efter shack vid förflyttning */ 

function horizontalCheckFunction(startx, y, endx){

  let clearway = true
  
    
  if (startx > endx){
  
    for (let x=startx; x > endx; x--){
  
      let square = document.getElementById(`square ${y} ${x}`)
      let children = Array.from(square.children)
  
      if (children.length > 0){
  
        clearway = false
  
      }
    }
  }
  if (startx < endx){
  
    for (let x=startx; x < endx; x++){
  
      let square = document.getElementById(`square ${y} ${x}`)
      let children = Array.from(square.children)
  
      if (children.length > 0){
  
        clearway = false
  
      }
    }
  }
  return clearway
}

// Kollar vertikala förflyttningar
function verticalCheckFunction(x, starty, endy){

  let clearway = true

  // Om man rör sig åt negativ riktning
  if (starty > endy){

    for (let y=starty; y > endy; y--){
      let square = document.getElementById(`square ${y} ${x}`)
      let children = Array.from(square.children)
  
      if (children.length > 0){
  
        clearway = false
  
      }
    }
  }
  // Om man rör sig åt positiv riktning
  if (starty < endy){
  
    for (let y=starty; y < endy; y++){
  
      let square = document.getElementById(`square ${y} ${x}`)
      let children = Array.from(square.children)
  
      if (children.length > 0){
  
        clearway = false
  
      }
    }
  }
  return clearway
}

// Kollar diagonala förflyttningar
function diagonalCheckFunction(startx, starty, endx, endy){

  let clearway = true

  let y = starty
  let x = startx
  
  if (startx < endx){

    for (;x < endx; x++){

      let square = document.getElementById(`square ${y} ${x}`)
      let children = Array.from(square.children)

      if (children.length > 0){
        clearway = false
      }

      // Ändra y värdet beroende på om flyttning är i positiv/negativ i Y-värde
      if (starty < endy ){
        y++
      } else {
        y--
      }
    }
  }
  else {

    for (;x > endx; x--){

      let square = document.getElementById(`square ${y} ${x}`)
      let children = Array.from(square.children)

      if (children.length > 0){
        clearway = false
      }

      if (starty < endy ){
        y++
      } else {
        y--
      }      
    }
  }
  return clearway
}


function checkObstacles(startx, starty, endx, endy){
  
  // Antar att vägen är ledig och ändrar värdet till 'false' om detta inte stämmer
  let emptyLine = true

  // Förflyttning vertikalt
  if (startx === endx){
    
    emptyLine = verticalCheckFunction(startx, starty, endy)

  }

  //Horisontellt
  else if (starty === endy){

    emptyLine = horizontalCheckFunction(startx, starty, endx)

  }
  
  //Diagonalt
  else if (Math.abs(startx-endx) === Math.abs(starty-endy)){

    emptyLine = diagonalCheckFunction(startx, starty, endx, endy)

  }

  return emptyLine
}

function lookForCheck (piecetype, opponentx, opponenty, team){
  
  // Börjar med att anta att det är shack och om en ruta är blockerad ivägen så blir check = false
  let check = false

  // [0] = svarta kungen, [1] = vita kungen
  let kingarray = [...king]

  let kingx
  let kingy

  if (team === 'white'){
    
    let blackKing = kingarray[0]
    let blackKingSquare = blackKing.parentNode.id
    blackKingSquare = blackKingSquare.split(' ')
    
    kingx = blackKingSquare[2]
    kingy = blackKingSquare[1]

  } if (team === 'black'){

    let whiteKing = kingarray[1]
    let whiteKingSquare = whiteKing.parentNode.id
    whiteKingSquare = whiteKingSquare.split(' ')
    
    kingx = whiteKingSquare[2]
    kingy = whiteKingSquare[1]
  }

  let possibleCapture = eval(`${piecetype}Move(${opponentx},${opponenty},${kingx},${kingy})`)

  if (possibleCapture == true){
    
    let moveTypes = typeOfMove(piecetype)
    
    for (let i = 0; i < moveTypes.length; i++){

      let checkMove = moveTypes[i]

      //Om pjäsen kan röra sig vertikalt kolla efter vertikal shack
      if (checkMove == 'vertical'){

        if (opponentx === kingx){

          check = verticalCheckFunction(opponentx, opponenty, kingy)
          
          if (check = true){
            return check
          }
        }
      }

      // Om pjäsen kan röra sig horizontellt
      if (checkMove == 'horizontal'){
      
        if (opponenty === kingy){
      
          check = horizontalCheckFunction(opponentx, opponenty, kingx)
          
          if (check = true){
            return check
          }
        }
      }

      // Om pjäsen kan röra sig diagonalt
      if (checkMove == 'diagonal'){
        
        if (Math.abs(opponentx-kingx) === Math.abs(opponenty-kingy)){

          check = diagonalCheckFunction(opponentx, opponenty, kingx, kingy)
          
          if (check = true){
            return check
          }
        }
      }
    }
  }
  return check
}


socket.on('approved-move', (startx, starty, endx, endy) => {
  
  // Tar fram vilken ruta som pjäsen flyttas från och vilken "child" det är
  const startSquare = document.getElementById(`square ${starty} ${startx}`)
  const childrenArray = Array.from(startSquare.children)
  const child = childrenArray.pop()
  
  // Tar fram vilken ruta som den flyttas till
  const endSquare = document.getElementById(`square ${endy} ${endx}`)
  const endSquareChildrenArray = Array.from(endSquare.children)
  
  // Om det redan är en pjäs på den rutan så tas den bort
  if (endSquareChildrenArray.length > 0){

    endSquare.removeChild(endSquare.firstElementChild)
  
  }
  
  //Lägger till den flyttade pjäsen till den slutgiltiga rutan
  endSquare.append(child)



})