const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const saltRounds = 10;

//Create Schema
const UserAuthSchema = new mongoose.Schema(  {
    username: { type: String, required: true, unique:true },
    email: { type: String, required: true, unique:true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    createdat: { type: Date },
    updatedat: { type: Date }

});

UserAuthSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('password')) {
     const document = this
     bcrypt.hash(document.password, saltRounds, (err, hashedPassword) => {
        if (err) {
            next(err)
        } else {
            document.password = hashedPassword;
            next()
        }
     });
    } else {
        next()
    }
})


UserAuthSchema.methods.isCorrectPassword = function (pass, callback){
    bcrypt.compare(pass, this.password, function(err, same) {
        if (err) {
            callback(err)
        } else {
            callback(err, same)
        }
    })
}

module.exports = UserAuth = mongoose.model('userauth', UserAuthSchema, 'userauth');