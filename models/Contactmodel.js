const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);
require('mongoose-type-email');

//Create Schema
const ContactSchema = new Schema({
    name: { type: String, required:true },
    email: { type: String, required:true },
    subject: { type: String, required:true },
    message: { type: String, required:true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = Contact = mongoose.model('contact', ContactSchema, 'contact');