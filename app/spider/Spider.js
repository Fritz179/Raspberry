const Leg = require('./Leg.js')

const {sin, cos, tan, sqrt, asin, acos, atan, PI} = Math

class Spider {
  constructor() {
    this.legsName = ['l1', 'l2', 'l3', 'r1', 'r2', 'r3']

    //new Leg(deltaX, deltaY, coxaPin, femurPin, tibiaPin)
    this.l1 = new Leg(10, 5)
    // this.l2 = new Leg()
    // this.l3 = new Leg()
    // this.r1 = new Leg()
    // this.r2 = new Leg()
    // this.r3 = new Leg()
  }

  getState() {
    const state = {tilt: {
      x: this.pitch,
      y: this.roll,
      z: this.yaw
    }, legs: {}}

    this.legsName.forEach(name => {
      state.legs[name] = {
        x: this[name].goalX,
        y: this[name].goalY,
        z: this[name].goalZ
      }
    })
  }

  update() {
    this.legsName.forEach(name => {

    })
  }

  setRotation(roll, pitch, yaw) {
    this.roll = roll
    this.pitch = pitch
    this.yaw = yaw

    this.legsName.forEach(name => {
      this[name].updateRefPoint(roll, pitch, yaw)
    })
  }
}

class SpiderHandler {
  constructor() {
    this.spider = new Spider()
  }

  onKey(input) {

  }
}

const handler = new SpiderHandler()

module.exports = handler
