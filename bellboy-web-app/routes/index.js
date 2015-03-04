var express = require('express');

/* GET home page. */
module.exports = function(io){
  var router = express.Router();

  router.get('/', function(req, res) {
    res.render('index');
  });

  router.get('manage', function(req, res){
    res.render('manage');
  })

  router.get('/cards', function(req, res){
    res.render('cards');
  })

  router.get('/api/open', function(req, res) {
    io.emit('openDoor');
    res.end('OK');
  });

  router.get('/api/play/:sound', function(req, res) {
    io.emit('play', req.params.sound);
    res.end('OK');
  });

  router.get('/api/enable', function(req, res) {
    io.emit('enable');
    res.end('OK');
  });

  router.get('/api/disable', function(req, res) {
    io.emit('disable');
    res.end('OK');
  });


  return router;
}; 
