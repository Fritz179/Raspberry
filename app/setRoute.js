module.exports = (app, io) => {
  return (routeName, onConnect, onDisconnect) => {
    app.get(`/${routeName}`, (req, res) => {
      res.sendFile(path.join(__dirname, `public/${routeName}/index.html`));
    })

    if (typeof onConnect == 'function') {
      io.of(`/${routeName}`).on('connection', socket => {
        console.log(`New connection with a ${routeName} socket established`);
        onConnect(socket)

        socket.on('disconnect', () => {
          console.log(`Connection with a ${routeName} socket closed`);
          if (typeof onDisconnect == 'function') onDisconnect(socket)
        })
      })
    }
  }
}
