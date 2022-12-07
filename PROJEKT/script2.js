const Form = document.querySelector("[step-of-program]")
const step1 = document.getElementById("step1")
const step2 = document.getElementById("step2")
const formButton = document.getElementById("form-send")
const inviteButton = document.getElementById("invite")

step1.style.display = "block"


Form.addEventListener("click", e => {
    if (e.target === formButton){
        console.log("sheesh")
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

const board = document.getElementById("board")
let piecesArray = []
let squareArray = []

function createBoard() {
    for(i=0; i < 8; i++){
        let boardLines = document.createElement("div")
        boardLines.className = "boardLines"
        boardLines.id = `line ${i}`
        for(x=0; x<8; x++){
            let square = document.createElement("div")
            square.id = `square ${i}${x}`
            if((x+i) % 2 == 0){
                square.className = "white"
            }else {
                square.className = "brown"
            }
            squareArray.push(square)
            boardLines.appendChild(square)
        }
        board.appendChild(boardLines)
    }
}

function checkFunction(){
  console.log("tjooo")
}

function addPiece(y, x, typeOfPiece, side){
  const choosenSquare = document.getElementById(`square ${y}${x}`)
  let piece = document.createElement("img")
  piece.src = `images/${side} pieces/${side} ${typeOfPiece}.png`
  piece.className ="piece"
  piece.draggable = "true"
  piece.ondragstart = function(){
    console.log("Bree")
  }
  piece.ondragend = function(){
    console.log("tjoo")
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

  item.addEventListener("dragstart", function(){
    draggedItem = this
    setTimeout(function(){
      item.style.display = "none"
    }, 0)
  })
  item.addEventListener("dragend", function(){
    setTimeout(function(){
      draggedItem.style.display = "block"
      draggedItem = null
    }, 0)
  })
  for(let j = 0; j < squareArray.length; j++){
    const square = squareArray[j]

    square.addEventListener("dragover", function(e){
      e.preventDefault()
    })

    square.addEventListener("dragenter", function(e){
      e.preventDefault()
    })

    square.addEventListener("drop", function(){
      this.append(draggedItem)
    })
  }
}