const yocto = require('./yocto');

yocto.register(values => {
  let output = '';

  // Object.keys(values).forEach(key => {
  ['x', 'y', 'z'].forEach(key => {
    const val = Math.round(values[key] * 1000) / 1000
    output += `${key}: ${val}${space(10 - val.toString().length)}`
  })

  function space(num) {
    let output = ''

    for (let i = num; i > 0; i--) {
      output += ' '
    }

    return output
  }

  console.log(output);
})
