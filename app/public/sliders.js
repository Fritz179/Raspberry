const socket = io('/sliders');

const legs = ['l1', 'l2', 'l3', 'r1', 'r2', 'r3'], bones = ['coxa', 'femur', 'tibia']
const xOff = yOff = 200, xStep = 300, yStep = 100

function setup() {
  createCanvas(windowWidth, windowHeight)
  bones.forEach((bone, x) => {
    legs.forEach((leg, y) => {
      const slider = createSlider(0, 100, 50, 1)
      slider.position(xOff + x * xStep, yOff + y * yStep);
      slider.input(() => {
        socket.emit('command', {command: 'single-servo', bone, leg, value: slider.value()})
      })
    })
  })
  textSize(30)
  bones.forEach((bone, x) => {
    text(bone, xOff + x * xStep, yOff / 2)
  })
  legs.forEach((leg, y) => {
    text(leg, xOff / 2, yOff + y * yStep  )
  })
}
