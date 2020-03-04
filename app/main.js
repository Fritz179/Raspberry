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

// "use strict";
//
// require('yoctolib-es2017/yocto_api.js');
// require('yoctolib-es2017/yocto_tilt.js');
// require('yoctolib-es2017/yocto_compass.js');
// require('yoctolib-es2017/yocto_gyro.js');
// require('yoctolib-es2017/yocto_accelerometer.js');
//
// let tilt1, tilt2, compass, gyro, accelerometer, count;
//
// async function startDemo()
// {
//     await YAPI.LogUnhandledPromiseRejections();
//     await YAPI.DisableExceptions();
//
//     // Setup the API to use the VirtualHub on local machine
//     let errmsg = new YErrorMsg();
//     if(await YAPI.RegisterHub('127.0.0.1', errmsg) != YAPI.SUCCESS) {
//         console.log('Cannot contact VirtualHub on 127.0.0.1: '+errmsg.msg);
//         return;
//     }
//
//     // Select specified device, or use first available one
//     let serial = process.argv[process.argv.length-1];
//     if(serial[8] != '-') {
//         // by default use any connected module suitable for the demo
//         let anysensor = YTilt.FirstTilt();
//         if(anysensor) {
//             let module = await anysensor.module();
//             serial = await module.get_serialNumber();
//         } else {
//             console.log('No matching sensor connected, check cable !');
//             return;
//         }
//     }
//     console.log('Using device '+serial);
//     tilt1   = YTilt.FindTilt(serial + ".tilt1");
//     tilt2   = YTilt.FindTilt(serial + ".tilt2");
//     compass = YCompass.FindCompass(serial + ".compass");
//     gyro    = YGyro.FindGyro(serial + ".gyro");
//     accelerometer = YAccelerometer.FindAccelerometer(serial+".accelerometer");
//     count = 0;
//
//     refresh();
// }
//
// async function refresh()
// {
//     if (await tilt1.isOnline()) {
//         if (count % 10 == 0) {
//             console.log("tilt1\ttilt2\tcompass\tacc\tgyro");
//         }
//         console.log(
//             await tilt1.get_currentValue()+"\t"+
//             await tilt2.get_currentValue()+"\t"+
//             await compass.get_currentValue()+"\t"+
//             await accelerometer.get_currentValue()+"\t"+
//             await gyro.get_currentValue()
//         );
//         count++;
//     } else {
//         console.log('Module not connected');
//         count = 0;
//     }
//     setTimeout(refresh, 500);
// }
//
// startDemo();
