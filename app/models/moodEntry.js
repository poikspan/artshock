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
    moodId: {type: String, required: true},
    originalImage: {type: String, required: true}
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema, 'MoodEntry');