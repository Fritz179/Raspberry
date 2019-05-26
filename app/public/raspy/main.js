const socket = io('/raspy');
let capture, started = false, graphic, context, video

function setup() {
  const forwardButton = createButton('Van in avant')
  forwardButton.position(10, 100)
  forwardButton.mousePressed(() => socket.emit('command', 'forward', 10))

  const rotateButton = createButton('Gira in avant')
  rotateButton.position(10, 200)
  rotateButton.mousePressed(() => socket.emit('command', 'rotate', 90))

  capture = createCapture(VIDEO, () => video = document.getElementsByTagName('video')[0])
  capture.hide()

  graphic = document.createElement('canvas')
  context = graphic.getContext('2d')

  document.body.appendChild(graphic)
  frameRate(20)
}

const width = 150, height = 100
function draw() {
  if (video) {
    if (graphic.width != width) graphic.width = width
    if (graphic.height != height) graphic.height = height

    context.drawImage(video, 0, 0, graphic.width, graphic.height)
    const imageData = context.getImageData(0, 0, graphic.width, graphic.height)
    socket.emit('camera', JSON.stringify({arr: Array.from(imageData.data), width: imageData.width, height: imageData.height}))
    // socket.emit('camera2', JSON.stringify({arr: Array.from(imageData.data), width: imageData.width, height: imageData.height}))
  }
}
