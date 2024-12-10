const { Post, Like } = require("../models/indexModel.js")
const { STATUS_MESSAGE,STATUS_CODE} = require("../constants/constants.js");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");


const toggleLikePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(id);
    if (!post) {
      return sendErrorResponse(res,
        STATUS_MESSAGE.MSG_POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
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
    return sendSuccessResponse(res,
      responseMessage, {}, STATUS_CODE.OK);

  } catch (error) {
    return sendErrorResponse(res, error.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};


const toggleLikeList = async (req, res) => {
  try {
    const { skip, limit, page } = req.pagination;

    const likePost = await Like.find().skip(skip).limit(limit);;

    if (!likePost || likePost.length === 0) {
      return sendErrorResponse(res,
        STATUS_MESSAGE.MSG_NO_LIKED_POST, STATUS_CODE.NOT_FOUND)
    }
    const totalDocuments = await Like.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    sendSuccessResponse(res, STATUS_MESSAGE.MSG_LIKED_POST,
      { page, limit, totalPages, totalDocuments, likePost },
      STATUS_CODE.OK)

  } catch (err) {
    return sendErrorResponse(res, err.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
}


const getPostWithLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { skip, limit, page } = req.pagination
    const post = await Post.findById(id).select("content")
    if (!post) {
      return sendErrorResponse(res,
        STATUS_MESSAGE.MSG_POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
    }

    const totalDocuments = await Like.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);

    const likes = await Like.find({ postId: id, isDeleted: false })
      .select('createdBy').skip(skip).limit(limit);
    const likedBy = likes.map(like => like.createdBy)

    return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND,
      { page, limit, totalPages, totalDocuments, post, likedBy },
      STATUS_CODE.OK);

  } catch (err) {

    return sendErrorResponse(res, err.message,
      STATUS_CODE.INTERNAL_SERVER_ERROR)
  }
};




module.exports = { toggleLikePost, toggleLikeList, getPostWithLike };

