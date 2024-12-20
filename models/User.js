const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    password: { type: String, required: true }  // Store hashed password
});

const User = mongoose.model('User', userSchema);
module.exports = User;
