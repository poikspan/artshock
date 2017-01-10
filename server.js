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

// Connnect to database
mongoose.connect(database.url);
console.log("Connected to database.");

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

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/index.html');
});

io.on('connection', function (socket) {
    setInterval(function() {
        moodCtrl.readMood(function(message) {
            console.log("Message: ", message);
            if (typeof message !== 'undefined' && message !== null) {
                socket.emit('new-mood', {mood:message});
            }
        });
    }, 3 * 1000); // 3 * 1000 milsec 
    // socket.on('other_event', function (data) {
    //     console.log(data);
    // });
});