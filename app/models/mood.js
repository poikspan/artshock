'use strict';

/*
 * Module dependencies
 */

var mongoose = require('mongoose');

/*
 * User model
 */
 
var moodSchema = mongoose.Schema({
    moodType: {type: String, required: true},
    title: {type: String, required: true},
    text: {type: String, required: false},
    soundfilePath: {type: String, required: false},
    videofilePath: {type: String, required: false},
    imagefilePath: {type: String, required: false},    
});

module.exports = mongoose.model('Mood', moodSchema, 'Mood');