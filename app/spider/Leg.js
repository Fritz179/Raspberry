// const Gpio = require('pigpio').Gpio;
const {sin, cos, tan, sqrt, asin, acos, atan, sign, PI} = Math

class Leg {
  constructor(x, y, coxa, femur, tibia) {
    this.baseX = x
    this.baseY = y
    this.baseL = sqrt(x * x + y * y)
    this.roll = 0
    this.pitch = 0
    this.yaw = 0

    this.coxa = getServo(coxa)
    this.femur = getServo(femur)
    this.tibia = getServo(tibia)
    this.coxaL = 0
    this.femurL = 10
    this.tibiaL = 10

    this.deltaX = 0
    this.deltaY = 0
    this.deltaZ = 0

    this.goalX = 10
    this.goalY = 0
    this.goalZ = 10

    this.updateRefPoint(0, 0, 0)
  }

  updateRefPoint(roll, pitch, yaw) {
    const {baseX, baseY} = this

    this.roll = roll
    this.pitch = pitch
    this.yaw = yaw

    //roll
    const rollL = cosLaw(baseX, baseX, roll) * sign(roll)
    const rollA = PI / 2 - (PI - roll) / 2
    let x = baseX - sin(rollA) * rollL
    let z = -cos(rollA) * rollL

    //pitch
    const baseLX = sqrt(baseY * baseY + z * z)
    const pitchL = cosLaw(baseLX, baseLX, pitch) * sign(pitch)
    const pitchA = PI / 2 - (PI - pitch) / 2 + atan(z / baseY)
    let y = baseY - sin(pitchA) * pitchL
    z += cos(pitchA) * pitchL

    //yaw
    const baseLZ = sqrt(x * x + y * y)
    const yawL = cosLaw(baseLZ, baseLZ, yaw) * sign(yaw)
    const yawA = PI / 2 - (PI - yaw ) / 2 + atan(y / x)
    x -= sin(yawA) * yawL
    y += cos(yawA) * yawL

    this.deltaX = this.baseX - x
    this.deltaY = this.baseY - y
    this.deltaZ = -z

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
    console.log(this.deltaX, this.deltaY, this.deltaZ);

    const coxaA = atan(y / x)
    const r = sqrt(x * x + y * y) - coxaL //from coxa to toe
    const l = sqrt(z * z + r * r)
    console.log(x, y, z);
    console.log(`femur: ${femurL}, tibia: ${tibiaL}, hypo: ${l}, coxaL: ${coxaL}`);

    const femurA = acos((femurL * femurL + l * l - tibiaL * tibiaL) / (2 * femurL * l)) //- atan(z / l)
    const tibiaA = acos((femurL * femurL + tibiaL * tibiaL - l * l) / (2 * femurL * tibiaL))

    this.coxa(coxaA)
    this.femur(femurA)
    this.tibia(tibiaA)
  }
}

function cosLaw(a, b, gamma) {
  return sqrt(a * a + b * b - 2 * a * b * cos(gamma))
}

function cosLawAngle(a, b, c) {
  return acos((a * a + b * b - c * c) / 2 * a * b)
}

module.exports = Leg

function getServo(pin) {
  // const servo = new Gpio(pin, {mode: Gpio.OUTPUT})

  return angle => {
    const pwm = angle / (PI * 2) * 2000 + 500
    console.log(pwm);

    if (pwm < 500 || pwm > 2500) console.log(`Invalid PWM: ${pwm}`);
    // else servo.servoWrite((angle * 2000 + 500) / (PI * 3))
  }
}
