const Post = require("../models/Post");
const { STATUS_MESSAGE } = require("../constants/constants.js");
const { StatusCodes } = require("http-status-codes");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");

const getPosts = async (req, res) => {
    try {
        const post = await Post.find().populate("createdBy", "username email")
        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND,post, StatusCodes.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (post.length === 0) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND,post, StatusCodes.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
};

const createPost = async (req, res) => {
    try {
        const userId = req.user.id;
        const newContent = new Post({
            content: req.body.content,
            createdBy: userId,
        });
        const post = await newContent.save();

        return sendSuccessResponse(res,STATUS_MESSAGE.MSG_CONTENT_SAVED,post,StatusCodes.CREATED);
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndUpdate(id, req.body);

        if (post.length === 0) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_CONTENT_NOT_FOUND,StatusCodes.NO_CONTENT);
        }
        const updatePost = await Post.findById(id);
        sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_UPDATED,updatePost, StatusCodes.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
};

const softDeletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(id);

        if (!post) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND, StatusCodes.NOT_FOUND)
        }
        if (post.createdBy.toString() !== userId.toString()) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_AUTH, StatusCodes.FORBIDDEN)
        }
        post.isDeleted = true;
        await post.save();
        return sendSuccessResponse(res,STATUS_MESSAGE.MSG_POST_DELETED,{}, StatusCodes.OK)
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
};

const restorePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(id);

        if (!post) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND, StatusCodes.NOT_FOUND)
        }
        if (post.createdBy.toString() !== userId.toString()) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_USER_NOT_AUTH, StatusCodes.FORBIDDEN);
        }

        post.isDeleted = false;
        await post.save();

        sendSuccessResponse(res,STATUS_MESSAGE.MSG_POST_RESTORE,{}, StatusCodes.OK)
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};


module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    softDeletePost,
    restorePost
};