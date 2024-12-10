const { Post, Comment } = require('../models/indexModel.js')
const { STATUS_MESSAGE, STATUS_CODE } = require("../constants/constants.js");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");

const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;
        const { comment } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        const newComment = new Comment({
            postId,
            comment,
            createdBy: userId,
            isDeleted: false,
        });

        await newComment.save();
        return sendSuccessResponse(res,
            STATUS_MESSAGE.MSG_COMMENT_ADD, newComment, STATUS_CODE.CREATED);
    } catch (err) {
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

const editComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;
        const { comment } = req.body;

        if (!comment) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_COMMENT_CONTENT_REQ, STATUS_CODE.BAD_REQUEST);
        }

        const commentToEdit = await Comment.findById(commentId);

        if (!commentToEdit || commentToEdit.isDeleted) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        if (!commentToEdit.createdBy.equals(userId)) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_USER_NOT_AUTH, STATUS_CODE.FORBIDDEN);
        }

        commentToEdit.comment = comment;
        await commentToEdit.save();

        return sendSuccessResponse(res,
            STATUS_MESSAGE.MSG_COMMENT_UPDATE, commentToEdit, STATUS_CODE.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const commentToDelete = await Comment.findById(commentId);

        if (!commentToDelete) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        if (!commentToDelete.createdBy.equals(userId)) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_USER_NOT_AUTH, STATUS_CODE.FORBIDDEN);
        }

        commentToDelete.isDeleted = true;
        await commentToDelete.save();

        return sendSuccessResponse(res,
            STATUS_MESSAGE.MSG_COMMENT_DELETE, {}, STATUS_CODE.OK);

    } catch (err) {
        console.log(err);
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

const undeleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const commentToUndelete = await Comment.findOne({ _id: commentId });

        if (!commentToUndelete) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_COMMENT_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        if (!commentToUndelete.createdBy.equals(userId)) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_USER_NOT_AUTH, STATUS_CODE.FORBIDDEN);
        }

        commentToUndelete.isDeleted = false;
        await commentToUndelete.save();

        return sendSuccessResponse(res,
            STATUS_MESSAGE.MSG_COMMENT_UNDELETE, {}, STATUS_CODE.OK);
    } catch (err) {
        return sendErrorResponse(res,
            err.message, STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};

const commentList = async (req, res) => {
    try {
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1
            : req.query.sortOrder === 'asc' ? 1 : -1;
        const { skip, limit, page } = req.pagination
        const commentPost = await Comment.find().
            skip(skip).limit(limit).sort({ [sortBy]: sortOrder });


        if (!commentPost || commentPost.length === 0) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_COMMENT_POST_NOT_FOUND, STATUS_CODE.NOT_FOUND)
        }
        const totalDocuments = await Comment.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);

        sendSuccessResponse(res, STATUS_MESSAGE.MSG_COMMENT_POST_FOUND,
            { page, limit, totalPages, totalDocuments, commentPost },
            STATUS_CODE.OK)

    } catch (err) {
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR);

    }
}

const getPostWithComment = async (req, res) => {
    try {
        const { skip, limit, page } = req.pagination
        const { id } = req.params;
        const post = await Post.findById(id).select("content");


        if (!post) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 :
            req.query.sortOrder === 'asce' ? 1 : -1;

        const totalDocuments = await Comment.countDocuments();
        const totalPages = Math.ceil(totalDocuments / limit);

        const comment = await Comment.find({ postId: id, isDeleted: false })
            .select('comment createdBy createdAt')
            .skip(skip).limit(limit).sort({ [sortBy]: sortOrder })

        const comments = comment.map((item) => {
            return {
                comment: item.comment,
                createdBy: item.createdBy,
                createdAt: item.createdAt
            }
        })

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND,
            { page, limit, totalPages, totalDocuments, post, comments },
            STATUS_CODE.OK);

    } catch (err) {
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR)
    }
};

module.exports = {
    addComment,
    editComment,
    deleteComment,
    undeleteComment,
    getPostWithComment,
    commentList
};