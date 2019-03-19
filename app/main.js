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

createPage('raspy')
createPage('sliders')

function createPage(name) {
  app.get(`/${name}`, (req, res) => {
    res.sendFile(path.join(__dirname, `public/${name}.html`));
  })

  io.of(`/${name}`).on('connection', socket => {
    console.log(`New connection with a ${name} socket established`);

    socket.on('command', ({command, ...options}) => {
      fritz(command, options)
    })

    socket.on('disconnect', () => {
      console.log(`Connection with a ${name} socket closed`);
    })
  })
}

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
