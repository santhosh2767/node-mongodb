const Post = require("../models/Post");
const Comment = require('../models/Comment.js');
const { STATUS_MESSAGE } = require("../constants/constants.js");
const { StatusCodes } = require("http-status-codes");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");

const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;
        const { comment } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const newComment = new Comment({
            postId,
            comment,
            createdBy: userId,
            isDeleted: false,
        });

        await newComment.save();
        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_COMMENT_ADD, newComment, StatusCodes.CREATED);
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};




const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        const { comment } = req.body;

        if (!comment) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_COMMENT_CONTENT_REQ, StatusCodes.BAD_REQUEST);
        }

        const commentToEdit = await Comment.findById(commentId);

        if (!commentToEdit || commentToEdit.isDeleted) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_COMMENT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        if (!commentToEdit.createdBy.equals(userId)) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_AUTH, StatusCodes.FORBIDDEN);
        }

        commentToEdit.comment = comment;
        await commentToEdit.save();

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_COMMENT_UPDATE, commentToEdit, StatusCodes.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};


const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const commentToDelete = await Comment.findById(commentId);

        if (!commentToDelete) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_COMMENT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        if (!commentToDelete.createdBy.equals(userId)) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_AUTH, StatusCodes.FORBIDDEN);
        }

        commentToDelete.isDeleted = true;
        await commentToDelete.save();

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_COMMENT_DELETE,{}, StatusCodes.OK);
    } catch (err) {
        console.log(err);
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};


// Undelete Comment
const undeleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        
        const commentToUndelete = await Comment.findOne({_id:commentId });
      
        console.log(commentToUndelete);
        

        if (!commentToUndelete) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_COMMENT_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        if (!commentToUndelete.createdBy.equals(userId)) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_AUTH, StatusCodes.FORBIDDEN);
        }

        commentToUndelete.isDeleted = false;
        await commentToUndelete.save();

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_COMMENT_UNDELETE,{}, StatusCodes.OK);
    } catch (err) {
        console.log(err);
        
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};



module.exports = {
    addComment,
    editComment,
    deleteComment,
    undeleteComment,
};