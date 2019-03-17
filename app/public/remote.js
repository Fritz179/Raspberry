const socket = io('/remote');

socket.emit('command', 'forward')
