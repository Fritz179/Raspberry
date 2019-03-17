require('dotenv').config();

//setup express and socket.io
const io = require('socket.io')()
const express = require('express')
const app = express()
const path = require('path')
const fritz = require('./fritz.js');

//Set public directory and favicon
app.use('/' , express.static(path.join(__dirname, 'public')))

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/favicon.ico'))
})

//set raspy route
app.get('/raspy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/raspy.html'));
})

io.of('/raspy').on('connect', socket => {
  console.log('Raspy connected!');

  socket.on('command', (command, ...options) => {
    fritz(command, ...options)
  })

  socket.on('disconnect', () => {
    console.log('Raspy disconnected!!!');
  })
})

//set remote page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/remote.html'));
})

io.of('/remote').on('connection', socket => {
  console.log('New connection with a remote socket established');

  socket.on('command', (command, ...options) => {
    fritz(command, ...options)
  })

  socket.on('disconnect', () => {
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
