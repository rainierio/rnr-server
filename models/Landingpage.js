const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const LandingSchema = new Schema({
    introtext: {
        type: String
    },
    introtextlink: {
        type: String
    }
});

module.exports = Landing = mongoose.model('landing', LandingSchema, 'home');