//connect with raspberry
const legsName = ['l1', 'l2', 'l3', 'r1', 'r2', 'r3'], bonesName = ['coxa', 'femur', 'tibia'], servosName = [], servos = []
// const Gpio = require('pigpio').Gpio

const pins = [
  [0, 0, 0], // l1
  [0, 0, 0], // l2
  [0, 0, 0], // l3
  [0, 0, 0], // r1
  [0, 0, 0], // r2
  [0, 0, 0]  // r3
]

const basePWM = [
  [0, 0, 0], // l1
  [0, 0, 0], // l2
  [0, 0, 0], // l3
  [0, 0, 0], // r1
  [0, 0, 0], // r2
  [0, 0, 0]  // r3
]

pins.forEach((leg, i) => {
  servos[legsName[i]] = {}, servos[i] = []
  leg.forEach((pin, j) => {
    servos[i][j] = {servoWrite: () => {}}
    // servosName[legsName[i]][bonesName[j]] = servos[i][j] = new Gpio(pin, {mode: Gpio.OUTPUT})
  })
})

let prevPWM
function createMatrix(leg, bone, value) {
  let i = legsName.indexOf(leg)
  let j = bonesName.indexOf(bone)
  prevPWM[i][j] = value
  applyMatrix(prevPWM)
}

function setServos(matrix) {
  prevPWM = matrix
  applyMatrix(matrix)
}

function applyMatrix(matrix) {
  console.log(matrix);
  matrix.forEach((leg, i) => {
    leg.forEach((value, j) => {
      servos[i][j].servoWrite((basePWM[i][j] + value) * 20 + 500)
    })
  })
}

//create Master class
class Movement {
  constructor() {
    this.tick = 0
    this.lifeTime = 1000
  }

  _update(deltaTime) {
    this.tick += deltaTime
    if (typeof this.update == 'function') this.update(this.tick)
  }

  kill(callback) { callback() }
}

class SingleServo extends Movement {
  constructor({leg, bone, value}) {
    super()
    this.lifeTime = 99999999
    createMatrix(leg, bone, value)
  }
}

class GoIdle extends Movement {
  constructor() {
    super()
    this.lifeTime = 99999999

    const idlePWM = [
      [0, 0, 0], // l1
      [0, 0, 0], // l2
      [0, 0, 0], // l3
      [0, 0, 0], // r1
      [0, 0, 0], // r2
      [0, 0, 0]  // r3
    ]

    setServos(idlePWM)
  }
}

class ForwardMovement extends Movement {
  constructor() {
    super()
    this.offset = 500
  }

  update(dt) {
    const c = this.getCoxa, f = this.getFemur, t = this.getTibia, o = this.offset

    const PWM = [
      [c(dt), f(dt), t(dt)], // l1
      [c(dt - o), f(dt - o), t(dt - o)], // l2
      [c(dt), f(dt), t(dt)], // l3
      [c(dt - o), f(dt - o), t(dt - o)], // r1
      [c(dt), f(dt), t(dt)], // r2
      [c(dt - o), f(dt - o), t(dt - o)]  // r3
    ]

    setServos(PWM)
  }

  getCoxa(dt) {

  }

  getFemur(dt) {

  }

  getTibia(dt) {

  }
}

module.exports = {
  forward: ForwardMovement,
  idle: GoIdle,
  "single-servo": SingleServo
}
