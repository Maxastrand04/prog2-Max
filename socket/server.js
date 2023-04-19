const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let players = []

app.use(express.static('public'))

http.listen(3000, function(){
    console.log('listening on *:3000');
  });

io.on('connection', socket => {
    players.push(`${socket.id}`)
    if (players.length === 1){
        console.log("player one connected")    
    } else if (players.length === 2){
        console.log("player two connected")
        http.close()
        console.log("server closed!")
    } 

    
    socket.on('clicked', data => {
        let playernumber = players.indexOf(`${socket.id}`) 
        playernumber += 1
        console.log(`${playernumber}: ${data}`)
        socket.emit('response', 'response from server!')
    })

    socket.on('disconnect', () => {
        let playernumber = players.indexOf(`${socket.id}`)
        players.splice(playernumber, 1)
        console.log(`player ${playernumber + 1} disconnected!`)
        http.listen(3000, function(){
            console.log('listening on *:3000');
          });
    })
})


app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  });