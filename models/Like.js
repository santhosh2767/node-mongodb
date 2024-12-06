const mongoose = require('mongoose');
const { COLLECTIONS } = require('../constants/constants');
const LikeSchema = new mongoose.Schema({
  postId:{ type: mongoose.Schema.Types.ObjectId, ref:'Post'},
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted:{type:Boolean, default:false}
}, {

  timestamps: true
});

module.exports = mongoose.model(COLLECTIONS.LIKE, LikeSchema);
