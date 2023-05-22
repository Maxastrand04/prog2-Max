// Ger åtkomst alla html objekt som behövs i programmet

const Form = document.querySelector('[step-of-program]')
const IP_Page = document.getElementById('IP-Address-page')
const Gameplay = document.getElementById('Gameplay')
const closeButton = document.getElementById('close')
const getIPButton = document.getElementById('getIP')
const board = document.getElementById('board')
const IPAddress = document.getElementById('IP-Address')
const returnToBoardButton = document.getElementById('return-to-board')
const gameOverScreen = document.getElementById('game-over-screen')

let draggedItem       // Håller koll på den flyttade pjäsen
let startSquare       // Håller koll på vilken ruta pjäsen flyttas från
let starty = 0        // Startrutans y-koordinat
let startx = 0        // Startrutans x-koordinat
let GAMEOVER = false  // Spelet är inte över vid starten 

let piecesArray = []  // Pjäserna läggs in här för att kunna loopas och ge alla funktioner som behövs
let squareArray = []  // Rutorna läggs in här för att kunna loopas och ge alla funktioner som behövs

import {kingMove, queenMove, bishopMove, knightMove, rookMove, pawnMove} from './rules.js'  // Importerar reglerna från en annan fil

// Brädet visas direkt vid spelets början
Gameplay.style.display = 'block'

// uppkopplingen till servern med socket.io
const socket = io()

// Några konstanta stränger som används för att ha koll på olika händelser
const shortCastleString = 'shortCastle'
const longCastleString = 'longCastle'
const enPassantString = 'en Passant'
const enPassantClass = 'enpassant'
const movedClass = 'moved'
const enpassantKillString = 'en Passant Kill'
const promotionString = 'promotion'
const boardWaitString = 'boardwait'

let player 
let socketID

socket.on('connect', ()=>{
  
  socketID = `${socket.id}`
  return socketID
})

socket.on('type-of-player', (clientArray) =>{
   
  // Om spelaren är för de vita pjäserna
  if (socketID == clientArray[0]){ 
    player = 'white' 
  }

  // För de svarta så speglas brädet så att det ser rätt ut för spelaren
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
})

// Hämtar IP adressen från servern för att kunna tas fram så man kan skicka den till en annan spelare
socket.on('Get-server-IP', ServerIP =>{

  // Lägger till port för att göra adressen komplett och kopierbar
  ServerIP = `${ServerIP}:3000`

  IPAddress.innerHTML = ServerIP
  IPAddress.setAttribute("data-clipboard-text", ServerIP)
})

// Om du stänger ner IP-rutan
Form.addEventListener('click', e => {
    if (e.target === closeButton){
        Gameplay.style.display = 'block'
        IP_Page.style.display = 'none'
    }
})

// Om du öppnar IP-rutan
Gameplay.addEventListener('click', e =>{
  if (e.target === getIPButton){
    Gameplay.style.display = 'none'
    IP_Page.style.display = 'block'
  }
}
)

gameOverScreen.addEventListener('click', e=>{
  if (e.target === returnToBoardButton){
    Gameplay.style.display = 'block'
    gameOverScreen.style.display = 'none'
  }
})

//Kopierar IP-adressen till "Clipboard" för att kunna skicka till den andra spelaren
IPAddress.addEventListener('click', function() {

  let textToCopy = IPAddress.getAttribute('data-clipboard-text')

  navigator.clipboard.writeText(textToCopy)
})

// Skapar brädet
function createBoard() {

    // Skapar 8 rader med olika y-koordinater - y = 0-7
    for(let y=0; y < 8; y++){

        let boardLines = document.createElement('div')
        boardLines.className = 'boardLines'
        boardLines.id = `line ${y}`
        
        // Skapar 8 rutor för varje rad - x = 0-7
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
function addPiece(y, x, typeOfPiece, team){

  // y = rad
  // x = column
  // TypeOfPiece = vilken pjäs
  // Side = vilket lag

  const choosenSquare = document.getElementById(`square ${y} ${x}`)

  let piece = document.createElement('img')
  piece.id = `${typeOfPiece}`
  piece.src = `images/${team} pieces/${team} ${typeOfPiece}.png`
  piece.className =`piece ${team}`
  piece.draggable = 'true'

  // Ser till att flytta pjäsen in i vald ruta
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


// Lägger till alla funktioner som krävs för att spara koordinater och allmänna default inställningar för hemsidan ska se till att pjäsen får flyttas
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

// Här sköts alla default inställningar för hur hemsidan ska hantera drag and drop, men också implementerar alla funktioner som används inom spelet
for (let j = 0; j < squareArray.length; j++){
  const square = squareArray[j]

  // Ser till att sidan inte gör sitt defaultbehandling vid "drag and drop" 
  square.addEventListener('dragover', function(e){
    e.preventDefault()
  })

  /*  Allt som sker i "addeventListener('drop')" funktionen är att kolla alla regler
      för att se ifall något regelbrott har gjorts under förflyttningen */ 
  square.addEventListener('drop', function(e){
    
    // Lägger till pjäsen i den nya rutan och kollar vilken typ av pjäs som flyttats
    this.append(draggedItem)
    let endSquare = square.id

    // Om spelet inte är över så går den vidare
    if (GAMEOVER === true){
      returnToSquareFunction()
      return
    }

    // Om en förflyttning har skett där man inte släpper pjäsen tillbaka i startrutan
    if (startSquare !== endSquare){
      let stringToArray = endSquare.split(' ')
        
      let endy = stringToArray[1] // Får fram y-koordinaten
      let endx = stringToArray[2] // Får fram x-koordinaten


      /*  Timeout funktionen är till för att se till att allting som sker innan detta är gjort
          och alla variabler är deklarerade för att kunna fortsätta funktionen*/
      setTimeout( function(){

        /*  Tar fram en array med alla pjäser som finns på den specifika rutan 
            för att se om förflyttning var godkänd eller inte och därmed bestämma vad som ska göras */
        let children = Array.from(square.children)

        // Tar ur den sista tillagda pjäsen och kollar om förflyttningen var godkänd
        let movedPiece = children.pop()
        
        //Variabel som håller koll på om förflyttningen är godkänd
        let moveCheck

        // Håller koll på om en pjäs har tagits - antar att det är falskt
        let takenPiece = false

        // Håller koll på om det är ett specialdrag som görs - antar att det är falskt
        let specialMove = false

        // Får fram vilken färg pjäsen har genom att kolla vilken klass den tillhör
        let team = movedPiece.className
        let stringToArray = team.split(' ')

        // laget är på klassindex [1]
        team = stringToArray[1]

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

          // Kollar om bonden har flyttats tidigare för att kunna tillåta dubbelsteg
          let pawnsThatAreMoved = [...document.getElementsByClassName(movedClass)]
          let firstMove = true
        
          if (pawnsThatAreMoved.includes(movedPiece)){
        
            firstMove = false
        
          }

          // Kollar vilken sida bonden tillhör för att se till att den kan förflyttas åt rätt håll
          let team = movedPiece.className
          let stringToArray = team.split(' ')
          team = stringToArray[1]

          // Antar att pjäsen INTE tar en annan pjäs och kollar ifall den gör i if-satsen
          let kill = false

          // En tom variabel som har koll på vilken ruta den pjäsen som har blivit tagen har
          let enPassantSquare

          // Kollar om pjäsen tar en annan för att använda andra regler
          if (children.length > 0){
          
            kill = true  
            takenPiece = true            
          
          }
          
          // Kollar om pjäsen tar en annan bonde i En Passant - för vit
          else if (team === 'white'){

            // Kollar om det finns en pjäs i den rutan
            const lookForEnPassantSquare = document.getElementById(`square ${Number(endy) + 1} ${endx}`)

            if (lookForEnPassantSquare.children.length > 0){

              let lookForEnPassant = Array.from(lookForEnPassantSquare.children).pop()

              // Ifall pjäsen har klassen En Passant
              if (lookForEnPassant.className.includes(enPassantClass)){

                kill = true                               // Den tar en pjäs
                specialMove = enpassantKillString         // Specialdrag - En Passant
                enPassantSquare = lookForEnPassantSquare  // I denna ruta ska pjäsen tas bort

              }
            }
          } 
          // För svart
          else if (team === 'black'){

            // Kollar om det finns en pjäs i rutan
            const lookForEnPassantSquare = document.getElementById(`square ${Number(endy) - 1} ${endx}`)

            if (lookForEnPassantSquare.children.length > 0){

              let lookForEnPassant = Array.from(lookForEnPassantSquare.children).pop()

              //Kollar om den tillhör klassen En Passant
              if (lookForEnPassant.className.includes(enPassantClass)){

                kill = true                               // Den tar en pjäs
                specialMove = enpassantKillString         // Specialdrag - En Passant
                enPassantSquare = lookForEnPassantSquare  // I denna ruta ska pjäsen tas bort
                
              }
            }
          }

          // Bondens speciella regelfunktion för att kolla om förflyttningen följer reglerna
          // Då skickas: startkordinaterna, om den tog en pjäs, vilket lag den tillhör, om det var första draget
          moveCheck = pawnMove(startx, starty, endx, endy, kill, team, firstMove)
          
          // Lägger till html-klass move efter att pjäsen har flyttats och en passant om ett dubbelsteg är gjort
          if (moveCheck.approvedMove === true){

            //Om den inte redan har moved klassen
            if (movedPiece.className.includes(movedClass) == false){
              
            movedPiece.className += ` ${movedClass}`

            }

            // Om den returnerar att den är aktiv för En Passant
            if (moveCheck.enPassant === true){

              movedPiece.className += ` ${enPassantClass}`
              
              specialMove = enPassantString

            }

            // Tar bort bonden som blir tagen i ett En Passant drag
            if (specialMove === enpassantKillString){

              enPassantSquare.removeChild(enPassantSquare.firstElementChild)

            }
            // Bonden blir drottning ifall den når hela vägen
            
            if (moveCheck.promotion === true){
              specialMove = promotionString
            }
          } 

          // Är förflyttningen inte godkänd så skickas pjäsen tillbaka till sin ordinarie plats
          else {
            returnToSquareFunction()
            return
          }
        }

        // Special regler för kungen också
        else if (movedPiece.id == 'king'){

          // Definierar variabler
          let movedPieces = [...document.getElementsByClassName(movedClass)]
          let shortCastleAllowed = true
          let longCastleAllowed = true

          // Kollar ifall kungen är flyttad och då får man inte göra någon rokad
          if (movedPieces.includes(movedPiece)){

            shortCastleAllowed = false
            longCastleAllowed = false

          }

          // Kollar om tornet för den långa och korta rokaden är flyttade i en for-loop 
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
                castleAllowed = false
              }

              //Om tornet är flyttat så får man inte göra rokad
              if (rook.className == movedClass){
                castleAllowed = false
              }
            }
            // Om rutan är tom så får man inte göra en rokad
            else {
              castleAllowed = false
            }

            // returnerar om rokaden är tillåten och vilken som är det isånafall
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
        
            // för alla förutom en ruta så kollar den ifall det finns någon ivägen och returnerar false om det är sant
            if (i !== 1){
              if (children.length > 0){
        
                longCastleAllowed = false
          
              }
            }

            // Ifall det är den rutan kungen ska gå till så kollar den om det finns ytterligare en till pjäs i rutan
            else {
              if (children.length > 1){

                longCastleAllowed = false

              }
            }
          }

          // Kollar så kungen går regelmässigt godkänt 
          moveCheck = kingMove(startx, starty, endx, endy, shortCastleAllowed, longCastleAllowed)

          // Om flytten är godkänd
          if (moveCheck.approvedMove === true){

            // Om det är en kort rokad
            if (moveCheck.shortCastle === true){
              const endRookSquare = document.getElementById(`square ${starty} 5`)
              const rook = Array.from(shortCastleSquare.children).pop()
              endRookSquare.append(rook)

              specialMove = shortCastleString
            }
            // Om det är en lång rokad
            else if (moveCheck.longCastle === true){
              const endRookSquare = document.getElementById(`square ${starty} 3`)
              const rook = Array.from(longCastleSquare.children).pop()
              endRookSquare.append(rook)

              specialMove = longCastleString
            }
          }
          // Om flytten inte är godkänd
          else{
            returnToSquareFunction()
            return
          }

        }

        // När andra pjäser förflyttas så används denna istället
        else{
          moveCheck = eval(`${movedPiece.id}Move(${startx}, ${starty}, ${endx}, ${endy})`)
        }

        /* För alla pjäser förutom kungen och bonden så kan movecheck endast returnera true eller false.
        Därför kommer detta ignoreras ifall det är kungen eller bonden som flyttas då dess check sker tidigare*/
        if (movedPiece.id !== 'king' && movedPiece.id !== 'pawn'){
          
          // Ifall förflyttningen inte är enligt reglerna så skickas pjäsen till sin ordinarie plats
          if (moveCheck !== true){

            returnToSquareFunction()
            return

          }
          // Ser till att den första pjäsen som var i rutan blir borttagen om det är olika lag på dem
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
              // annars så sparas att den första pjäsen ska tas bort
              else {
                takenPiece = true
              }
            }
          }
        } 

        // Kollar så det är din tur
        socket.emit('move', startx, starty, endx, endy, team, specialMove)

        // Numrerar alla meddelanden som inkommer från servern
        let skipMoves = 0

        socket.on('turn-check', (yourTurn) => {   
          
          // Genom att öka denna variabel med 1 så har man koll på vilken som är den senaste
          skipMoves += 1

          //Det senaste draget får nummer 1 och ska därmed köras - resten ignoreras
          if (skipMoves === 1){

                
            // Ifall det är din tur
            if (yourTurn === true){

              // Ifall du tar ut en motståndares pjäs så ska den tas bort
              if (takenPiece === true){

                let removedPiece = square.removeChild(square.firstElementChild)

                if (removedPiece.id === 'king'){
                  GAMEOVER = true
                  board.classList += boardWaitString
                  
                  Gameplay.style.display = 'none'
                  gameOverScreen.style.display = 'block'
                  return
                }        
              }

              // Tar bort klassen "en Passant" efter sin tur då möjligheten för det draget försvinner om det finns en bonde som det gick att göra en passant på
              let enPassantPawn = [...document.getElementsByClassName(enPassantClass)]
              
              if (enPassantPawn > 0){
                
                for (let i = 0; i < enPassantPawn; i++){

                  enPassantPawn[0].classList.remove(enPassantClass)

                }
              }
            }
        
            //Ifall det INTE är din tur så skickas pjäsen tillbaka till sin ordinarie ruta
            else {
          
            returnToSquareFunction()
            return
        
            }

            // Behöver spara ifall pjäserna har flyttats för eventuella framtida rokader
            if (movedPiece.id === 'rook' || movedPiece.id === 'king'){

              movedPiece.className += ` ${movedClass}`

            }

            // Bonden blir drottning ifall den når hela vägen
            if (moveCheck.promotion === true){
              movedPiece.id = 'queen'
              movedPiece.src = `images/${team} pieces/${team} ${movedPiece.id}.png`
            }

            // Gör brädet genomskinligt för att indikera att din tur är över
            board.classList += ` ${boardWaitString}`
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
 2: Kollar efter hinder i en kort rokad */ 

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

// En allmän funcktion som returner det flyttade objektet till sin ordinarie plats ifall förflyttningen inte är godkänd
function returnToSquareFunction(){
          
  let returnToSquare = document.getElementById(startSquare)
  returnToSquare.append(draggedItem)

}

socket.on('approved-move', (startx, starty, endx, endy, specialMove) => {  

  // Tar fram vilken ruta som pjäsen flyttas från och vilken "child" det är
  const startSquare = document.getElementById(`square ${starty} ${startx}`)
  const childrenArray = Array.from(startSquare.children)
  const child = childrenArray.pop()
  
  // Tar fram vilken ruta som den flyttas till
  const endSquare = document.getElementById(`square ${endy} ${endx}`)
  const endSquareChildrenArray = Array.from(endSquare.children)
  
  // Lägger till den flyttade pjäsen till den slutgiltiga rutan
  endSquare.append(child)

  // Om det redan är en pjäs på den rutan så tas den bort
  if (endSquareChildrenArray.length > 0){

    let removedPiece = endSquare.removeChild(endSquare.firstElementChild)
    if( removedPiece.id == 'king'){
      GAMEOVER = true
      Gameplay.style.display = 'none'
      gameOverScreen.style.display = 'block'
    }
  }

  // Tar bort enPassant klassen från alla pjäser som har den
  let enPassantArray = [...document.getElementsByClassName(enPassantClass)]
  for (let i = 0; i < enPassantArray.length; i++){
    enPassantArray[i].classList.remove(enPassantClass)
  }

  // Om en motståndares bonde är möjlig att ta i En Passant
  if (specialMove === enPassantString){
    const pawnsquare = document.getElementById(`square ${endy} ${endx}`)
    const enPassantPawn = pawnsquare.children[0] 

    enPassantPawn.className += ` ${enPassantClass}`
  }

  // Ifall en bonde har blivit tagen med en passant
  else if(specialMove === enpassantKillString){
    let takenPawnSquare
    
    // Kollar ifall motståndarens pjäs är vit för att veta vilken ruta som är precis bakom den
    if (child.className.includes('white')){
      takenPawnSquare = document.getElementById(`square ${Number(endy)+1} ${endx}`)
    } 

    // Samma för svarta pjäser
    else {
      takenPawnSquare = document.getElementById(`square ${Number(endy)-1} ${endx}`)
    }

    // tar bort den pjäsen som blivit tagen
    takenPawnSquare.removeChild(takenPawnSquare.firstElementChild)
  }

  // Ifall förflyttningen är en rokad så flyttas även tornet
  else if (specialMove === shortCastleString){
    const rookSquare = document.getElementById(`square ${endy} 7`)
    const rook = rookSquare.children[0]

    const endRookSquare = document.getElementById(`square ${endy} 5`)
    endRookSquare.append(rook)
  }

  // Ifall det är lång rokad istället
  else if (specialMove === longCastleString){
    const rookSquare = document.getElementById(`square ${endy} 0`)
    const rook = rookSquare.children[0]

    let endRookSquare = document.getElementById(`square ${endy} 3`)
    endRookSquare.append(rook)
  }

  //Ifall en bonde blir Uppgraderad till drottning
  else if (specialMove === promotionString){
    const promotedPawnSquare = document.getElementById(`square ${endy} ${endx}`)
    const promotedPawn = promotedPawnSquare.children[0]
    const team = promotedPawn.classList[1]
    promotedPawn.id = 'queen'
    promotedPawn.src = `images/${team} pieces/${team} ${promotedPawn.id}.png`
  
    
  }

  // Gör brädet helt ifyllt för att indikera att det är din tur
  if (GAMEOVER === false){
    board.classList.remove(boardWaitString)
  }
})

