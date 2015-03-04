var apiCaller = require('../bellboy-broker')();
var sys = require('sys')
var exec = require('child_process').exec;
var path = require('path');

var expressStaticImagesPath = path.join(__dirname, "..", "bellboy-web-app/public/snapshot.png");

var command = "fswebcam --no-banner --png 4 -r 640x480 " + expressStaticImagesPath;

apiCaller.on('takeSnapshot', function(){
  console.log("takeSnapshot")
  console.log("running", command)
  exec(command, function(error, stdout, stderr){
    if (!error){
      console.log("snapshotTaken");
      apiCaller.emit('snapshotTaken');
    }
  });
});
