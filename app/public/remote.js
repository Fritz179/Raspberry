const socket = io('/remote');

graphic = document.createElement('canvas')
context = graphic.getContext('2d')

document.body.appendChild(graphic)

socket.on('camera', img => {
  const {arr, width, height} = JSON.parse(img)
  console.log(width, height);

  if (graphic.width != width) graphic.width = width
  if (graphic.height != height) graphic.height = height

  const imageData = new ImageData(Uint8ClampedArray.from(arr), width, height)
  context.putImageData(imageData, 0, 0)
})
