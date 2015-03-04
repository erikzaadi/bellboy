socket.on('doorStatus', function (data) {
  console.log(data);
});
function openClick() {
  socket.emit('openDoor');
}
