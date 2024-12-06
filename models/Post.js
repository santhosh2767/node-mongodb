const mongoose = require('mongoose');
const {COLLECTIONS} = require('../constants/constants');

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }
}, {

    timestamps: true
});


module.exports = mongoose.model(COLLECTIONS.POST, postSchema);
