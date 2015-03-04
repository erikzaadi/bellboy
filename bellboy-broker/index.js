var ioClient = require('socket.io-client');
module.exports = function(){
  var client = ioClient("http://127.0.0.1:3000");
  return client;
};
