"use strict";

require('yoctolib-es2017/yocto_api.js');
require('yoctolib-es2017/yocto_tilt.js');
require('yoctolib-es2017/yocto_compass.js');
require('yoctolib-es2017/yocto_gyro.js');
require('yoctolib-es2017/yocto_accelerometer.js');

const {exec} = require('child_process');
const BAND_WIDTH = 200

async function startModule() {
  exec('start /min C:/Users/fabri/Downloads/VirtualHub/VirtualHub.exe')

  let tilt1, tilt2, compass, gyro, acc

  await YAPI.LogUnhandledPromiseRejections();
  await YAPI.DisableExceptions();

  // Setup the API to use the VirtualHub on local machine
  let errmsg = new YErrorMsg();
  if(await YAPI.RegisterHub('127.0.0.1', errmsg) != YAPI.SUCCESS) {
      console.log('Cannot contact VirtualHub on 127.0.0.1: ' + errmsg.msg);
      return;
  }

  // Select specified device, or use first available one
  let serial = process.argv[process.argv.length-1];
  if (serial[8] != '-') {
      // by default use any connected module suitable for the demo
      let anysensor = YTilt.FirstTilt();
      if (anysensor) {
          let module = await anysensor.module();
          serial = await module.get_serialNumber();
      } else {
          console.log('No matching sensor connected, check cable! (bambursa)');
          return;
      }
  }
  console.log('Using device ' + serial);
  tilt1   = YTilt.FindTilt(serial + ".tilt1");
  tilt2   = YTilt.FindTilt(serial + ".tilt2");
  compass = YCompass.FindCompass(serial + ".compass");
  gyro    = YGyro.FindGyro(serial + ".gyro");
  acc     = YAccelerometer.FindAccelerometer(serial + ".accelerometer");

  // function refresh() {
  //
  //   Promise.all([
  //     tilt1.get_currentValue(),
  //     tilt2.get_currentValue(),
  //     compass.get_currentValue(),
  //     YAPI.HandleEvents()
  //   ]).then(([x, y, z]) => {
  //
  //     if (output.x != x || output.y != y || output.z != z) {
  //       output.x = x
  //       output.y = y
  //       output.z = z
  //       output.c++
  //     }
  //
  //     output.g++
  //     refresh()
  //   })
  // }

  while (!await tilt1.isOnline()) {
    console.log('waiting');
  }

  // refresh()

  // await tilt1.set_reportFrequency('10/s')
  // await tilt1.registerTimedReportCallback(log, 10)
  await tilt1.registerValueCallback(logTilt1)
  await tilt1.set_advMode(tilt1.ADVMODE_IMMEDIATE)
  await tilt1.set_bandwidth(BAND_WIDTH)
  await tilt2.registerValueCallback(logTilt2)
  await tilt2.set_advMode(tilt2.ADVMODE_IMMEDIATE)
  await tilt2.set_bandwidth(BAND_WIDTH)
  await compass.registerValueCallback(logCompass)
  await compass.set_advMode(compass.ADVMODE_IMMEDIATE)
  await compass.set_bandwidth(BAND_WIDTH)
  await gyro.registerValueCallback(logGyro)
  await gyro.set_advMode(gyro.ADVMODE_IMMEDIATE)
  await acc.registerValueCallback(logAcc)
  await acc.set_advMode(acc.ADVMODE_IMMEDIATE)

  while (true) {
    await YAPI.Sleep(1000 * 60) // 1 min
  }

  // await tilt1.set_logFrequency('60/m')
  // await tilt1.startDataLogger()
  // await YAPI.RegisterLogFunction(log => console.log('asdf'))

  // async function log(a, b) {
  //   console.log(b);
  //   module.exports.c++
  // }
}
startModule()

const values = {
  x: 0, px: 0, dx: 0,
  y: 0, py: 0, dy: 0,
  z: 0, pz: 0, dz: 0,
  g: 0, pg: 0, dg: 0,
  a: 0, pa: 0, da: 0
}

function logTilt1(obj, x) {
  values.dx = x - values.px
  values.px = values.x
  values.x = x
  log('x')
}

function logTilt2(obj, y) {
  values.dy = y - values.py
  values.py = values.y
  values.y = y
  log('y')
}

function logCompass(obj, z) {
  values.dz = z - values.pz
  values.pz = values.z
  values.z = z
  log('z')
}

function logGyro(obj, g) {
  values.dg = g - values.pg
  values.pg = values.g
  values.g = g
}

function logAcc(obj, a) {
  values.da = a - values.pa
  values.pa = values.a
  values.a = a
}

let total = 0
let names = {
  x: 0,
  y: 0,
  z: 0
}

let c = 0
function log(name) {

  if (total < 3) {
    if (!names[name]) {
      names[name] = 1
      total++
      return
    }
  }

  total = 0
  names.x = 0
  names.y = 0
  names.z = 0

  listeners.forEach(listener => {
    listener(values)
  })

  // c++
  // if (c % 100 == 0) {
  //   console.log(c);
  // }
}

const listeners = new Set()

module.exports.register = fun => listeners.add(fun)
module.exports.unregister = fun => listeners.remove(fun)
// module.exports = {x: 0, y: 0, z: 0, a: 0, g: 0, addListener: listener => {
//   listeners.add(listener)
// }, removeListener: listener => {
//   listeners.remove(listener)
// }}
