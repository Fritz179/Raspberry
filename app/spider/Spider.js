const Leg = require('./Leg.js')
const values = require('./values.json')

class Spider {
  constructor() {
    this.legsName = ['r1', 'r2', 'r3', 'l1', 'l2', 'l3']

    this.legsName.forEach((name, i) => {
      this[name] = new Leg(values[name], i > 2)
    })
  }

  getState() {
    const state = {
      tilt: {
        x: this.pitch,
        y: this.roll,
        z: this.yaw
      }
    }

    state.legs = {}
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
      this[name].update()
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

  setPosition(legs) {
    Object.keys(legs).forEach(name => {
      this[name].setPosition(legs[name])
    })
  }
}

module.exports = Spider
