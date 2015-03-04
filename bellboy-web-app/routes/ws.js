var Datastore = require('nedb');
var cards = new Datastore({ filename: './db/cards', autoload: true });
var Q = require('q');

function sanitizeScan(id) {
  return id.toString().replace(/[^a-zA-Z0-9]/g, "");
}

module.exports = function(io){
  io.on('connection', function(socket){
    console.log('connection');


    //NOTE: Messages that are only proxied, not handled
    var proxyEchos = [
      'openButton',
      'doorChanged',
      'openDoor',
      'enable',
      'disable',
      'buzzard',
      'play',
      'takeSnapshot',
      'snapshotTaken',
      'listSounds',
      'listSoundsResult',
      'listConfiguredSounds',
      'listConfiguredSoundsResult',
      'downloadSound',
      'setSoundForEvent'
    ];

    proxyEchos.forEach(function(command){
      var currentCommand = command; //Closure FTL
      socket.on(currentCommand, function(data){
        console.log(currentCommand, data);
        socket.broadcast.emit(currentCommand, data);
      })
    });

    socket.on('scan', function(data){
      console.log('scan', data.id.toString());
      socket.broadcast.emit('scan', data);
      cards.findOne({id:sanitizeScan(data.id)}, {_id:0}, function(err, card){
        if (err){
          console.log("error", err);
          return;
        }
        if (!card){
          console.log('unidentified', card);
          return io.sockets.emit('unidentified', data.id.toString());
        }
        socket.broadcast.emit('openDoor');
        console.log('identified', card);
        io.sockets.emit('identified', card);
      });
    });

    socket.on('addCard', function(data){
      console.log('addCard', data);
      cards.insert({id:data.id, user:data.user}, function(err, card){
        console.log("Inserted", err, card);
      });
    });

    socket.on('removeCard', function(data){
      console.log('removeCard', data);
      Q.ninvoke(cards, "remove", {id:data.id}).then(function(card){
      });
    });

    socket.on('listCards', function(data){
      console.log('listCards', data);
      cards.find({}, function(err, cards){
        socket.emit('listCardsResult', cards);
      });
    });
  });
};
