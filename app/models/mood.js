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
    fileType: {type: String, required: true},
    filePath: {type: String, required: true}
});

module.exports = mongoose.model('Mood', moodSchema);