const mongoose = require('mongoose');
const { COLLECTIONS } = require('../constants/constants')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    profilepic: { type: String },

}, {

    timestamps: true
});

module.exports = mongoose.model(COLLECTIONS.USER, userSchema);
