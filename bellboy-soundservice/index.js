var Player = require('player');
var apiCaller = require('../bellboy-broker')();
var path = require('path');
var fs = require('fs');
var request = require('request');

var soundDir = path.join(__dirname, 'sounds');
var soundConfigPath = path.join(__dirname, 'sounds.config.json');
var sounds = {};

var soundFiles = [];

function reloadSounds() {
  soundFiles = fs.readdirSync(soundDir).map(function(mp3FileName){
    return mp3FileName.slice(0, -(path.extname(mp3FileName).length));
  });
  if (fs.existsSync(soundConfigPath)){
    sounds = require(soundConfigPath);
  } else {
    sounds = {"open":null, "buzzard":null};
    fs.writeSync(soundConfigPath, JSON.stringify(sounds), {encoding:'utf8'});
  }
}

reloadSounds();

function downloadSound(url){
  console.log('downloadSound', url);
  request(url).pipe(fs.createWriteStream(path.basename(url))).on('close', function(){
    reloadSounds();
  });
}

function setSoundForEvent(event, sound){
  console.log('setSoundForEvent', event, sound);
  sounds[event] = sound;
  fs.writeSync(soundConfigPath, JSON.stringify(sounds), {encoding:'utf8'});
  reloadSounds();
}

var currentSound = null;

var playerInstance = null;

function playComplete(){
  console.log("play complete");
  playerInstance = null;
  currentSound = null;
}

function play(sound) {
  console.log("play", sound)
  if (playerInstance) {
    console.log('play, instance active');
    playerInstance.stop();
  }
  console.log("playing", sound);
  var selectedSound = sounds[sound] || sound;
  if (soundFiles.indexOf(selectedSound) == -1){
    console.log("sound not found", selectedSound);
    return;
  }
  selectedSound += ".mp3";
  playerInstance = new Player(path.join(soundDir, selectedSound));
  currentSound = selectedSound;
  playerInstance.play(playComplete);
}

function stop() {
  console.log("stop");
  if (playerInstance){
    console.log("stopping");
    playerInstance.stop();
  }
}

apiCaller.on('buzzard', function(){
  console.log("buzzard");
  //NOTE: Don't play the buzzard sound if it's already playing
  if (!playerInstance && currentSound != "buzzard"){
    play('buzzard');
  }
});

apiCaller.on('doorChanged', function(data){
  console.log("door", data.status);
  //NOTE: Stopped playing when closing the door, was to annoying.
  if (data.status == "open"){
    play(data.status);
  }
});

apiCaller.on('play', function(data) {
  console.log("play", data);
  if (!playerInstance && !currentSound){
    play(data);
  }
})

apiCaller.on('listSounds', function(){
  console.log("listSounds");
  apiCaller.emit('listSoundResult', soundFiles);
});

apiCaller.on('listConfiguredSounds', function(){
  console.log("listConfiguredSounds");
  apiCaller.emit('listConfiguredSoundResult', sounds);
});

apiCaller.on('downloadSound', function(data){
  console.log("downloadSound", data);
  downloadSound(data.url);
});

apiCaller.on('setSoundForEvent', function(data){
  console.log("setSoundForEvent", data);
  setSoundForEvent(data.event, data.sound);
});
