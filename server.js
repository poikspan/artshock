var http = require('http');
var express = require('express');
var port = process.env.PORT || '8080';
var app = express();
var server = http.createServer(app);
server.listen(port);
console.log("Server running on port "+port);

var fs = require('fs');
var readline = require('readline');
var atob = require('atob');
var mongoose = require('mongoose');
var database = require('./app/config/database.js');
var mood = require('./app/models/mood.js');
var moodCtrl = require('./app/controllers/mood.js');
var Buffer = require('buffer').Buffer;

// Connnect to database
mongoose.Promise = global.Promise;
mongoose.connect(database.url, function(err) {
  if ( err ) {
    console.log('####NO connection to database!');
  }
});
console.log('Connected to database.');

var env = process.env.NODE_ENV || 'dev';

//For some reason AZURE can not install node-sass correctly, so using generated css on production, yaiks
if ( env == 'dev') {
    var sass = require('node-sass');
    var cssFile = './public/css/artshock.css';
    sass.render({
      file: './sass/artshock.scss',
      outFile: cssFile
    }, function(error, result) { 
        if(!error){
          // No errors during the compilation, write this result on the disk
          fs.writeFile(cssFile, result.css, function(err){
            if(!err){
                console.log('Css compiled!');
            }
          });
        }
    });    
}

io = require('socket.io')(server);

app.use(express.static('public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/index.html');
});

var Mood = require('./app/models/mood');
var MoodEntry = require('./app/models/moodEntry');

io.on('connection', function (socket) {
  setInterval(function() {
      moodCtrl.readMood(function(message) {
          if (typeof message !== 'undefined' && message !== null) {
            /*“anger” > vihainen
              “disgust” > inhottava
              “fear” > pelokas
              “happiness” > onnellinen
              “sadness” > surullinen
              “surprise” > yllättynyt*/
            var moodsObj;
            try {
                // Node 5.10+
              moodsObj = JSON.parse(Buffer.from(message.messageText, 'base64'));              
            }
            catch(err) {
                // older Node versions
                moodsObj = JSON.parse(new Buffer(message.messageText, 'base64'));
            }
            var queryParams = { moodType: moodsObj.prominent_emotion };
            // Count all moods with moodType
            Mood.count(queryParams).exec(function (err, count) {
              console.log('Count: ', count, ' for ', moodsObj.prominent_emotion);
              // Get a random entry
              var random = Math.floor(Math.random() * count)
              // Again query all moods for moodType but only fetch one offset by our random #
              Mood.findOne(queryParams).skip(random).exec(
                function (err, result) {
                  if (!err && result) {
                    moodEntry = new MoodEntry();
                    moodEntry.moodType = result.moodType;
                    moodEntry.moodId = result._id;
                    moodEntry.originalImage = moodsObj.file;
                    moodEntry.save(function(err) {
                      if ( err ) {
                        console.log(err);
                      }
                    });
                    moodsObj.image_file = result.imageFilePath;
                    moodsObj.video_file = result.videoFilePath;
                    moodsObj.sound_file = result.soundFilePath;
                    socket.emit('new-mood', { mood: moodsObj });
                  }
                })
            })
          }
      });
  }, 5 * 1000);
  // socket.on('other_event', function (data) {
  //     console.log(data);
  // });
});