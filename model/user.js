const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nim: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Login = mongoose.model('Login', UserSchema);

module.exports = Login;