const button = document.getElementById("press-me")

const socket = io()

socket.on('chat-message', data => {
    console.log(data)
})

button.addEventListener("click", e => {
    socket.emit('clicked', 'message from client')
})


socket.on('response', data => {
    console.log(data)
})