require('dotenv').config();

//setup express and socket.io
const io = require('socket.io')()
const express = require('express')
const app = express()
const path = require('path')

const fritz = require('./spider/fritz.js');
const setRoute = require('./setRoute.js')(app, io)

const remotes = new Set(), sliders = new Set()
let raspy = null

//Set public directory and favicon
app.use('/' , express.static(path.join(__dirname, 'public')))

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/favicon.ico'))
})

//set all routes
setRoute('raspy', socket => {
  raspy = socket

  socket.on('camera', data => {
    remotes.forEach(remote => remote.emit('camera', data))
  })
})

setRoute('sliders', socket => {
  sliders.add(socket)

  socket.on('command', ({command, ...options}) => {
    fritz.command(command, options)
  })
}, socket => {
  sliders.delete(socket)
})

// setInterval(() => {
//   const matrix = fritz.getMatrix()
//   sliders.forEach(socket => socket.emit('new-sliders', matrix))
// }, 1000 / 30)

//set remote page
app.get('/', (req, res) => res.redirect('/remote'))

setRoute('remote', socket => {
  remotes.add(socket)

  socket.on('command', (command, ...options) => {
    fritz.command(command, ...options)
  })
}, socket => {
  remotes.delete(socket)
})

app.get('*', (req, res) => {
  res.redirect('/')
})

//connect Server to localhost
const Server = app.listen(process.env.PORT || 1234, () => {
  console.log(`200: Server online on: http://localhost:${Server.address().port} !!`);
  io.attach(Server)
})
