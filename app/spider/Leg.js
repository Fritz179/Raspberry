// const Gpio = require('pigpio').Gpio;
const {sin, cos, tan, sqrt, asin, acos, atan, PI} = Math

class Leg {
  constructor(x, y, coxa, femur, tibia) {
    this.baseL = sqrt(x * x + y * y)
    this.baseYaw = atan(y / x)
    this.roll = 0
    this.pitch = 0
    this.yaw = this.baseYaw

    this.coxa = getServo(coxa)
    this.femur = getServo(femur)
    this.tibia = getServo(tibia)
    this.coxaL = 1
    this.femurL = 2
    this.tibiaL = 3

    this.deltaX = 0
    this.deltaY = 0
    this.deltaZ = 0

    this.goalX = 10
    this.goalY = 10
    this.goalZ = 10

    this.updateRefPoint(0, 0, 0)
  }

  updateRefPoint(roll, pitch, yaw) {
    this.roll = roll
    this.pitch = pitch
    this.yaw = yaw = yaw + this.baseYaw

    // const newPos = getPoint(this.baseL, x, y, z) //??
    // Euler Angles
    // 3d matrix rotation?

    // this.deltaX = newPos.x
    // this.deltaY = newPos.y
    // this.deltaZ = newPos.z

    this.moveTo(this.goalX, this.goalY, this.goalZ)
  }

  moveTo(x, y, z) {
    const {coxaL, femurL, tibiaL} = this

    this.goalX = x
    this.goalY = y
    this.goalZ = z

    x -= this.deltaX
    y -= this.deltaY
    z -= this.deltaZ

    const coxaA = atan(y / x)
    const r = sqrt(x * x + y * y) - coxaL
    const l = sqrt(z * z + r * r)

    const femurA = acos((femurL * femurL + r * r - tibiaL * tibiaL) / 2 * femurL * r) - atan(z / r)
    const tibiaA = acos((femurL * femurL + tibiaL * tibiaL - r * r) / 2 * femurL * tibiaL)

    this.coxa(coxaA)
    this.femur(femurA)
    this.tibia(tibiaA)
  }
}

module.exports = Leg

function getServo(pin) {
  // const servo = new Gpio(pin, {mode: Gpio.OUTPUT})

  return angle => {
    console.log(angle);
    // servo.servoWrite((angle * 2000 + 500) / (PI * 3))
  }
}
