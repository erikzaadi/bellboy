var enableButton = document.getElementById('enable');
var disableButton = document.getElementById('disable');


function enable(){
  socket.emit('enable');
}

function disable(){
  socket.emit('disable');
}

