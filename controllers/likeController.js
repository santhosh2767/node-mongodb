const Post = require("../models/Post");
const Like = require('../models/Like.js');

const { STATUS_MESSAGE } = require("../constants/constants.js");
const { StatusCodes } = require("http-status-codes");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");


const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    if (!post) {
      return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    let likeDoc = await Like.findOne({ postId: id, createdBy: userId });

    if (!likeDoc) {
      likeDoc = new Like({
        postId: id,
        createdBy: userId,
        isDeleted: false,
      });
      responseMessage = STATUS_MESSAGE.MSG_POST_LIKED;
    } else {

      if (likeDoc.isDeleted === false) {

        likeDoc.isDeleted = true;
        responseMessage = STATUS_MESSAGE.MSG_POST_DISLIKED;
      } else {
        likeDoc.isDeleted = false;
        responseMessage = STATUS_MESSAGE.MSG_POST_LIKED
      }
    }

    await likeDoc.save();

    return sendSuccessResponse(res, responseMessage,{}, StatusCodes.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message, StatusCodes.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { toggleLikePost };

