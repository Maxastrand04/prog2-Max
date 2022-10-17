const Form = document.querySelector("[step-of-program]")
const step1 = document.getElementById("step1")
const step2 = document.getElementById("step2")
const formButton = document.getElementById("form-send")

step1.style.display = "block"


Form.addEventListener("click", e => {
    if (e.target === formButton){
        console.log("sheesh")
        step2.style.display = "block"
        step1.style.display = "none"
    }

    //else if (e.target.matches("[send]")){
      //  console.log("sheesh")
        //step2.style.display = "block"
        //step1.style.display = "none"
    //} 
})

const board = document.getElementById("board")

function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

function createBoard() {
    for(i=0; i < 8; i++){
        let boardLines = document.createElement("div")
        boardLines.className = "boardLines"
        for(x=0; x<8; x++){
            let square = document.createElement("div")
            
            if((x+i) % 2 == 0){
                square.className = "white"
            }else {
                square.className = "brown"
            }

            boardLines.appendChild(square)
        }
        board.appendChild(boardLines)
    }
}

createBoard()