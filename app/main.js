require('dotenv').config();

//setup express and socket.io
const io = require('socket.io')()
const express = require('express')
const app = express()
const path = require('path')
const {fritz, getMatrix} = require('./fritz.js');

const remotes = new Set(), sliders = new Set()
let raspy = null

//Set public directory and favicon
app.use('/' , express.static(path.join(__dirname, 'public')))

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/favicon.ico'))
})

app.get(`/raspy`, (req, res) => {
  res.sendFile(path.join(__dirname, `public/raspy.html`));
})

io.of(`/raspy`).on('connection', socket => {
  console.log(`New connection with a raspy socket established`);
  raspy = socket

  socket.on('camera', data => {
    remotes.forEach(remote => remote.emit('camera', data))
  })

  socket.on('disconnect', () => {
    console.log(`Connection with a raspy socket closed`);
    raspy = null
  })
})

app.get(`/sliders`, (req, res) => {
  res.sendFile(path.join(__dirname, `public/sliders.html`));
})

io.of(`/sliders`).on('connection', socket => {
  console.log(`New connection with a sliders socket established`);
  sliders.add(socket)

  socket.on('command', ({command, ...options}) => {
    fritz(command, options)
  })

  socket.on('disconnect', () => {
    sliders.delete(socket)
    console.log(`Connection with a sliders socket closed`);
  })
})

setInterval(() => {
  const matrix = getMatrix()
  sliders.forEach(socket => socket.emit('new-sliders', matrix))
}, 1000 / 30)

//set remote page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/remote.html'));
})

io.of('/remote').on('connection', socket => {
  remotes.add(socket)
  console.log('New connection with a remote socket established');

  socket.on('command', (command, ...options) => {
    fritz(command, ...options)
  })

  socket.on('disconnect', () => {
    remotes.delete(socket)
    console.log('Connection with a remote socket closed');
  })
})

app.get('*', (req, res) => {
  res.redirect('/')
})

//connect Server to localhost
const Server = app.listen(process.env.PORT || 1234, () => {
  console.log(`200: Server online on: http://localhost:${Server.address().port} !!`);
  io.attach(Server)
})

class Client {
  constructor(type) {

  }
}

class SessionHandler {
 constructor() {
   this.clients = new Set()
 }

 addClient(client) {
   this.clients.add(client)
 }
}
