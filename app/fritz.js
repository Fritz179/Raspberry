const setStatus = module.exports = (newStatus = 'idle', ...args) => {
  console.log(newStatus, ...args);
  if (!Statuses[newStatus]) throw new Error(`Invaluid command: ${newStatus}, availabel: ${Object.keys(Statuses)}`)

  function killCallback() {
    statusname = newStatus
    status = new Statuses[newStatus](...args)
  }

  //if it needs to stop immediatly, it stops, else a movement can delay or refusing to die
  if (newStatus == 'idle') killCallback()
  else status.kill(killCallback.bind(this))
}

//set varaible variable
const Statuses = require('./Spider.js')
const updateSpeed = 100
let status, statusname
setStatus('idle')

//main function
function update() {
  status._update(updateSpeed)

  if (status.tick > status.lifeTime) setStatus('idle')
}

setInterval(update, updateSpeed)
