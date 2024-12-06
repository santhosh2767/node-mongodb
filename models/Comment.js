const mongoose = require('mongoose');
const { COLLECTIONS } = require('../constants/constants');

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false }, 
}, {

    timestamps: true
});
module.exports = mongoose.model(COLLECTIONS.COMMENT, commentSchema);