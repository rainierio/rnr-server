const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

//Create Schema
const messageSchema = new Schema({
    sendername: {
        type: String,
        required: [true, 'Just give me your name'],
        lowercase: true
    },
    senderemail: {     
        type: String,
        required: [true, 'Please fill in your email address'],
        lowercase: true,
        validate: [validateEmail, 'Give me your valid email address please']
    },
    sendermsg: {     
        type: String,
        required: [true, 'would you tell me your story please?'],
    },
    messagedate: {
        type: Date,
        default: Date.now
    }
});

module.exports = Message = mongoose.model('message', messageSchema, 'message');