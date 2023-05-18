const express = require('express');
const mime = require('mime')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const IP = require('ip');

const IP_Address = IP.address()


let clientArray = [0, 0]                  // Håller koll på vilken client som är vilken spelare
let turn = 'white'                        // Vit börjar 

let white_moves = []                      // En array för att hålla koll på alla förflyttningar som görs
let black_moves = []                      // Samma som överstående men för svarta drag

app.use(express.static('public'))         // kommer åt filerna under folder 'public'

//Öppnar servern så den kan lyssna efter klienter på port 3000*
http.listen(3000, function(){
  console.log(`Listening on IP-address: ${IP_Address}:3000 *`);
  
  });

io.on('connection', socket => {

  //Skickar IP-adressen till klienten så den kan visas för klienten
  socket.emit('Get-server-IP', IP_Address)

  // Skickar alla gjorda förflyttningar (om det har gjorts några) till spelaren som joinar
  // De vita dragen
  if (white_moves.length > 0){

    for (i = 0; i < white_moves.length; i += 4){

      socket.emit('approved-move', white_moves[i], white_moves[i+1], white_moves[i+2], white_moves[i+3])
      
      // Och de svarta
      if (i < black_moves.length){
      
        socket.emit('approved-move', black_moves[i], black_moves[i+1], black_moves[i+2], black_moves[i+3])
      
      }
    }
  }
  
  //Den första clienten blir spelare 1 och vit
    if (clientArray[0] === 0){
  
      clientArray[0] = `${socket.id}`
      console.log('player one connected')
      socket.emit('type-of-player', clientArray)  
    } 
    
    //Den andra blir spelare 2 och svart
    else if (clientArray[1] === 0){

      clientArray[1] = `${socket.id}`
      console.log('player two connected') 
      socket.emit('type-of-player', clientArray)
    
    } 

    //Om en tredje klient hoppar in så slängs den ut lika fort
    else if (clientArray[0] != 0 && clientArray[1] != 0){
    
      socket.disconnect('Stop right there')
      console.log('server CLOSED!')
      return;
    
    }

    //Lyssnar efter att en förflyttning görs och kollar om det är den personens tur
    socket.on('move', (startx, starty, endx, endy, team) =>{
    
      //Om det är din tur
      if (team == turn){
    
        socket.emit('turn-check', true)
        socket.broadcast.emit('approved-move', startx, starty, endx, endy)
        
        
        const move = [startx, starty, endx, endy]
        eval(`${team}_moves.push(${move})`)
        
    
        if (turn == 'white'){
          turn = 'black'
        }
    
        else {
          turn = 'white'
        }
      }

      //Om det inte är din tur
      else {
        socket.emit('turn-check', false )
        console.log('not your turn')
      }

    })

    //Om en klient lämnar så ser man till att den tas bort som spelare så en ny klient kan ta dess plats
    socket.on('disconnect', () => {
    
        let playernumber = clientArray.indexOf(`${socket.id}`)
        clientArray[playernumber] = 0
        console.log(`player ${playernumber + 1} disconnected!`)
    
    })
})


//Ser till att man kan komma åt klientsidan
app.get('/', function(req, res){
  
  res.sendFile(__dirname + '/index.html');

});

//Ser till att man kommer åt css filen
app.get('/styles.css', function(req, res) {
  
  var file = __dirname + '/public/styles.css';
  res.setHeader('Content-Type', mime.lookup(file));
  res.sendFile(file);

});