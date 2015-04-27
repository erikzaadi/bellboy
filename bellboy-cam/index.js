var apiCaller = require('../bellboy-broker')();
var sys = require('sys');
var exec = require('child_process').exec;
var path = require('path');

//TODO: Needed? use temp path instead?
var expressStaticImagesPath = path.join(__dirname, "..", "bellboy-web-app/public/");

var fsWebCamCommand = "fswebcam --no-banner --png 4 -r 640x480 ";
var config = require(path.join(__dirname, "config.json"));
var s3 = require("s3");
var moment = require("moment");

var client = s3.createClient({
  s3Options: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  },
});

apiCaller.on('takeSnapshot', function(){
  console.log("takeSnapshot");
  var now = moment();
  var expires = now.clone().add(7, "days").toDate();
  var imageFileName = now.format("YYYY-MM-DD__hh-mm-ss.png");
  var commandWithTimeStamp = fsWebCamCommand + path.join(expressStaticImagesPath, imageFileName);
  console.log("running", commandWithTimeStamp);
  exec(commandWithTimeStamp, function(error, stdout, stderr){
    if (!error){
      console.log("snapshotTaken, saving with s3", imageFileName);
      var key = (config.prefix ? config.prefix : "") + imageFileName;
      var params = {
        localFile: path.join(expressStaticImagesPath, imageFileName),
        s3Params: {
          Bucket: config.bucket,
          Key: key,
          ACL: "public-read",
          Expires: expires
        },
      };
      var uploader = client.uploadFile(params);
      uploader.on('error', function(err) {
        console.error("unable to upload:", err.stack);
      });
      uploader.on('end', function() {
        var imagePublicUrl = s3.getPublicUrlHttp(config.bucket, key);
        console.log("snapshotTaken, saved to s3", imagePublicUrl);
        apiCaller.emit('snapshotTaken', imagePublicUrl);
          exec("rm " + params.localFile, function(e, o, se){
            if (!e){
              console.log("deleted snapshot", params.localFile);
            }
        });
      });
    }
  });
});
