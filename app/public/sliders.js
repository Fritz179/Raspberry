const socket = io('/sliders');

const legs = ['l1', 'l2', 'l3', 'r1', 'r2', 'r3'], bones = ['coxa', 'femur', 'tibia']
const xOff = yOff = 200, xStep = 300, yStep = 100
const sliders = []

function setup() {
  createCanvas(windowWidth, windowHeight)
  bones.forEach((bone, x) => {
    sliders[x] = []
    legs.forEach((leg, y) => {
      const slider = sliders[x][y] = createSlider(0, 100, 50, 1)
      slider.position(xOff + x * xStep, yOff + y * yStep);
      slider.input(() => {
        socket.emit('command', {command: 'single-servo', bone, leg, value: slider.value()})
      })
    })
  })
}

function draw() {
  background(255)
  fill(0)

  textSize(30)
  bones.forEach((bone, x) => {
    text(bone, xOff + x * xStep, yOff / 2)
  })
  legs.forEach((leg, y) => {
    text(leg, xOff / 2, yOff + y * yStep  )
  })

  sliders.forEach((bone, x) => {
    bone.forEach((leg, y) => {
      text(leg.value(), xOff + x * xStep, yOff + y * yStep)
    })
  })
}

socket.on('new-sliders', states => {
  states.forEach((leg, y) => {
    leg.forEach((bone, x) => {
      sliders[x][y].value(bone)
    })
  })
})
