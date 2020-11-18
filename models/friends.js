const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let FriendSchema = new Schema({
    firstName: String,
    lastName: String,
    phone: String,
    email: String,
    birthday: Date,
    callAnytime: Boolean
});

module.exports = mongoose.model('Friend', FriendSchema);