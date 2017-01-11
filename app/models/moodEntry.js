'use strict';

/*
 * Module dependencies
 */

var mongoose = require('mongoose');

/*
 * User model
 */
 
var moodEntrySchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    moodType: {type: String, required: true},
    moodId: {type: String, required: true}
    //img: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema, 'MoodEntry');