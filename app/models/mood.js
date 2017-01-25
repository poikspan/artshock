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
    title: {type: String, required: false},
    text: {type: String, required: false},
    soundFilePath: {type: String, required: false},
    videoFilePath: {type: String, required: false},
    imageFilePath: {type: String, required: false},    
});

module.exports = mongoose.model('Mood', moodSchema, 'Mood');