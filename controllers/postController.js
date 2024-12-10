const { Post, Like, Comment } = require("../models/indexModel.js")
const { STATUS_MESSAGE,STATUS_CODE } = require("../constants/constants.js");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");

const getPosts = async (req, res) => {
    try {
        const { skip, limit, page } = req.pagination;
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 :
            req.query.sortOrder === 'asce' ? 1 : -1;

        const posts = await Post.find().populate('content')
            .skip(skip).limit(limit).sort({ [sortBy]: sortOrder })

        const totalDocuments = await Post.countDocuments();

        const totalPages = Math.ceil(totalDocuments / limit);

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND,
            { page, limit, totalPages, totalDocuments, posts },
            STATUS_CODE.OK)

    } catch (err) {
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
};
const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post === 0) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_POST_NOT_FOUND, STATUS_CODE.NOT_FOUND);
        }

        const likeCount = await Like.countDocuments
            ({ postId: id, isDeleted: false })
        const commentCount = await Comment.countDocuments
            ({ postId: id, isDeleted: false })

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND,
            { post, likeCount, commentCount }, STATUS_CODE.OK);

    } catch (err) {
        console.log(err.message);

        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR)
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

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_CONTENT_SAVED,
            post, STATUS_CODE.CREATED);
    } catch (err) {
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR)
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndUpdate(id, req.body);

        if (post.length === 0) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_CONTENT_NOT_FOUND, STATUS_CODE.NO_CONTENT);
        }
        const updatePost = await Post.findById(id);
        sendSuccessResponse(res,
            STATUS_MESSAGE.MSG_POST_UPDATED, updatePost, STATUS_CODE.OK);

    } catch (err) {
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR)
    }
};

const softDeletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(id);

        if (!post) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_POST_NOT_FOUND, STATUS_CODE.NOT_FOUND)
        }
        if (post.createdBy.toString() !== userId.toString()) {
            return sendErrorResponse(res,
                TATUS_MESSAGE.MSG_USER_NOT_AUTH, STATUS_CODE.FORBIDDEN)
        }
        post.isDeleted = true;
        await post.save();
        return sendSuccessResponse(res,
            STATUS_MESSAGE.MSG_POST_DELETED, {}, STATUS_CODE.OK)
    } catch (err) {
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR)
    }
};

const restorePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const post = await Post.findById(id);

        if (!post) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_POST_NOT_FOUND, STATUS_CODE.NOT_FOUND)
        }
        if (post.createdBy.toString() !== userId.toString()) {
            return sendErrorResponse(res,
                STATUS_MESSAGE.MSG_USER_NOT_AUTH, STATUS_CODE.FORBIDDEN);
        }

        post.isDeleted = false;
        await post.save();

        sendSuccessResponse(res,
            STATUS_MESSAGE.MSG_POST_RESTORE, {}, STATUS_CODE.OK)
    } catch (err) {
        return sendErrorResponse(res, err.message,
            STATUS_CODE.INTERNAL_SERVER_ERROR);
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