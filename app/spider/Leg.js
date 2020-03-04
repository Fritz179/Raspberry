// const Gpio = require('pigpio').Gpio;
const {sin, cos, tan, sqrt, asin, acos, atan, sign, PI} = Math

class Leg {
  constructor(opt, flipped) {
    const x = opt.baseX, y = opt.baseY

    // unbetätigt values
    this.baseX = x
    this.baseY = y
    this.baseL = sqrt(x * x + y * y)
    this.roll = 0
    this.pitch = 0
    this.yaw = 0

    // save servo data
    this.coxa = getServo(opt.coxaPin, opt.deltaCoxaA)
    this.femur = getServo(opt.femurPin, opt.deltaFemurA)
    this.tibia = getServo(opt.tibiaPin, opt.deltaTibiaA)
    this.coxaX = opt.coxaX
    this.coxaZ = opt.coxaZ
    this.coxaL = sqrt(opt.coxaX * opt.coxaX + opt.coxaZ * opt.coxaZ)
    this.femurL = opt.femurL
    this.tibiaL = opt.tibiaL

    // reference to effective offset of startin position
    this.deltaX = 0
    this.deltaY = 0
    this.deltaZ = 0

    /* save current goal, used if
       only the reference point is updated */
    this.goalX = 10
    this.goalY = 0
    this.goalZ = 10

    // left legs are flipped in roll (wip)
    this.sign = flipped ? -1 : 1

    this.updateRefPoint(0, 0, 0)
  }

  updateRefPoint(roll, pitch, yaw) {
    const {baseX, baseY} = this

    // save position for getState of Spider
    this.roll = roll
    this.pitch = pitch
    this.yaw = yaw

    // outupt values, defaulted for yaw
    let x = this.baseX, y = this.baseY, z = 0

    // problemone: 1. ordine, 2. realtivo o assoluto?
    // lösig 5: sa l'ordine le giüst le assoluto (rpy) (realtif le miga svasu da assoluto?)
    //          invece sa le miga urdinu, le relatif noma sa qui
    //          prima glien dopu in dal urdan giüst

    // Euler's angles, quaternions https://eater.net/quaternions/video/intro

    // roll
    const rollL = cosLaw(baseX, baseX, roll) * sign(roll)
    const rollA = PI / 2 - (PI - roll) / 2
    x -= sin(rollA) * rollL
    z += cos(rollA) * rollL

    // pitch
    const pitchL = cosLaw(baseY, baseY, pitch) * sign(pitch)
    const pitchA = PI / 2 - (PI - pitch) / 2 + atan(z / baseY)
    y -= sin(pitchA) * pitchL
    z += cos(pitchA) * pitchL

    // yaw, if not used, output variable can all be defualtet to 0
    // const baseLZ = sqrt(x * x + y * y)
    const baseLZ = sqrt(baseX * baseX + baseY * baseY)
    const yawL = cosLaw(baseLZ, baseLZ, yaw) * sign(yaw)
    const yawA = PI / 2 - (PI - yaw ) / 2 + atan(y / x)
    x -= sin(yawA) * yawL
    y += cos(yawA) * yawL

    this.deltaX = this.baseX - x
    this.deltaY = this.baseY - y
    this.deltaZ = z

    this.moveTo(this.goalX, this.goalY, this.goalZ)
  }

  moveTo(x, y, z) {
    const {coxaL, femurL, tibiaL, toeL} = this

    // update new position for updateRefPoint
    this.goalX = x
    this.goalY = y
    this.goalZ = z
    x -= this.deltaX
    y -= this.deltaY
    z -= this.deltaZ

    // adjust for deltaToeL
    const coxaB = atan(y / x)
    x -= sin(coxaB) * toeL
    y += cos(coxaB) * toeL

    // get new values
    const coxaA = atan(y / x)
    const l = sqrt(x * x + y * y) - coxaL // from coxa to toe

    const femurA = acos((femurL * femurL + l * l - tibiaL * tibiaL) / (2 * femurL * l)) //- atan(z / l)
    const tibiaA = acos((femurL * femurL + tibiaL * tibiaL - l * l) / (2 * femurL * tibiaL))

    // adjust femur for height?
    femurA += asin(z / l) //??? mago ago dove es?
    // gal bisöin da cambia al sign sa le a sinistra?
    // parchi l le negativa?
    // parchi al servo le giru da l'altra?
    // o tüc doi quindi i sa cancelan a vicenda?

    this.coxa(coxaA)
    this.femur(femurA)
    this.tibia(tibiaA)
  }
}

function cosLaw(a, b, gamma) {
  // al da esa mudificu par a o b negatif?
  // angul cun lati negatif? tüc doi negatif?
  return sqrt(a * a + b * b - 2 * a * b * cos(gamma))
}

function cosLawAngle(a, b, c) {
  return acos((a * a + b * b - c * c) / 2 * a * b)
}

module.exports = Leg
