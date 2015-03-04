var GPIO = require('onoff').Gpio;
var DOOR_OPEN_TIMEOUT = 5 * 1000;

var apiCaller = require('../bellboy-broker')();

var insideOpenButton = new GPIO(22, 'in', 'both');
var outsideBuzzard   = new GPIO(17,  'in', 'both');
var doorController   = new GPIO(25, 'out');

var disabled = false;

var buzzardDisabled = false;


function exit (){
  insideOpenButton.unexport();
  outsideBuzzard.unexport();
  doorController.unexport();
  process.exit();
}

process.on('SIGINT', exit);


function openDoor(){
  console.log("openDoor");
  if (disabled){
    return console.log("not opening door, disabled");
  }
  if (doorController.readSync() == 0){
    console.log("door already open");
    return;
  }

  console.log("opening door");
  doorController.writeSync(0);
  apiCaller.emit('doorChanged', {status:'open'});
  setTimeout(function(){
    console.log("closing door");
    doorController.writeSync(1);
    apiCaller.emit('doorChanged', {status:'closed'});
  }, DOOR_OPEN_TIMEOUT);
}

apiCaller.on('openDoor', openDoor);

insideOpenButton.watch(function(err, value){
  console.log("inside", value);
  if (err){
    return;
  }
  if (value == 1){
    openDoor();
  }
});


outsideBuzzard.watch(function(err, value){
  console.log("outside", value);
  if (err){
    return;
  }
  if (value == 1 && !buzzardDisabled){
    apiCaller.emit('buzzard');
    buzzardDisabled = true;
    setTimeout(function(){
      buzzardDisabled = false;
    }, 1500);
  }
});

doorController.writeSync(1);

apiCaller.on('disable', function(){
  console.log('disabling');
  disabled = true;
  doorController.writeSync(0);
});

apiCaller.on('enable', function(){
  console.log('enabling');
  disabled = false;
  doorController.writeSync(1);
});
