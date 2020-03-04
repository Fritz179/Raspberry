const Spider = require('./Spider');

class Brain {
  constructor() {
    this.spider = new Spider()
  }
}

const defaultPosition = {
  tilt: {
    x: 0,
    y: 0,
    z: 0
  }
}

defaultPosition.legs = {};

['r', 'l'].forEach(side => {
  defaultPosition.legs[side + '1'] = {
    x: 5, y: 5, z: 0
  }
  defaultPosition.legs[side + '2'] = {
    x: 5, y: 0, z: 0
  }
  defaultPosition.legs[side + '3'] = {
    x: 5, y: -5, z: 0
  }
})
