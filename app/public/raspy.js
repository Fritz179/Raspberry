const socket = io('/raspy');

function setup() {
  const forwardButton = createButton('Van in avant')
  forwardButton.position(10, 100)
  forwardButton.mousePressed(() => socket.emit('command', 'forward', 10))

  const rotateButton = createButton('Gira in avant')
  rotateButton.position(10, 200)
  rotateButton.mousePressed(() => socket.emit('command', 'rotate', 90))
}
