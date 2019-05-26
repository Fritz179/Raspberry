const Leg = require('./Leg.js')

const {sin, cos, tan, sqrt, asin, acos, atan, PI} = Math

class Spider {
  constructor() {
    this.legsName = ['l1', 'l2', 'l3', 'r1', 'r2', 'r3']

    //new Leg(deltaX, deltaY, coxaPin, femurPin, tibiaPin)
    this.l1 = new Leg()
    this.l2 = new Leg()
    this.l3 = new Leg()
    this.r1 = new Leg()
    this.r2 = new Leg()
    this.r3 = new Leg()
  }

  update() {
    this.legsName.forEach(name => {

    })
  }

  setRotation(roll, pitch, yaw) {
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
