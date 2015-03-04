var apiCaller = require('../bellboy-broker')();

var SerialPort = require("serialport")
var serialPort = new SerialPort.SerialPort('/dev/ttyAMA0', {
  baudRate: 9600,
  parser: SerialPort.parsers.readline("\r\n")
});

serialPort.on("open", function () {
  console.log('serial open');
  serialPort.on('data', function(data) {
    console.log('data received: ' + data);
    apiCaller.emit('scan', {id: data.toString().replace(/[^a-zA-Z0-9]/g, "")});
  });
});
