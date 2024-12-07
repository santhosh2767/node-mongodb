const Post = require("../models/Post");
const Like = require("../models/Like.js");
const Comment = require("../models/Comment.js")
const { STATUS_MESSAGE } = require("../constants/constants.js");
const { StatusCodes } = require("http-status-codes");
const { sendErrorResponse, sendSuccessResponse } = require("../utils/utils");

const getPosts = async (req, res) => {
    try {
        const post = await Post.find().populate("createdBy", "username email")
        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND, post, StatusCodes.OK);
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post === 0) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const likeCount = await Like.countDocuments({ postId: id, isDeleted: false })
        const commentCount = await Comment.countDocuments({ postId: id, isDeleted: false })

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND, { post, likeCount, commentCount }, StatusCodes.OK);
    } catch (err) {
        console.log(err.message);

        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
};

const getPostWithLike = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).select("content")
        if (!post) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        const likes = await Like.find({ postId: id, isDeleted: false }).select('createdBy')
        const likedBy = likes.map(like => like.createdBy)

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND, { post, likedBy }, StatusCodes.OK);

    } catch (err) {
        console.log(err.message);

        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
};

const getPostWithComment = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).select("content");
        if (!post) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_POST_NOT_FOUND, StatusCodes.NOT_FOUND);
        }
        const comment = await Comment.find({ postId: id, isDeleted: false }).select('comment createdBy')

        const comments = comment.map((item) => {
            return {
                comment: item.comment,
                createdBy: item.createdBy
            }
        })

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_FOUND, { post, comments }, StatusCodes.OK);

    } catch (err) {
        console.log(err.message);

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

        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_CONTENT_SAVED, post, StatusCodes.CREATED);
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
};

const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findByIdAndUpdate(id, req.body);

        if (post.length === 0) {
            return sendErrorResponse(res, STATUS_MESSAGE.MSG_CONTENT_NOT_FOUND, StatusCodes.NO_CONTENT);
        }
        const updatePost = await Post.findById(id);
        sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_UPDATED, updatePost, StatusCodes.OK);
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
        return sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_DELETED, {}, StatusCodes.OK)
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

        sendSuccessResponse(res, STATUS_MESSAGE.MSG_POST_RESTORE, {}, StatusCodes.OK)
    } catch (err) {
        return sendErrorResponse(res, err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
};

const getPaginatedPosts = async (req, res) => {
    try {
      const { skip, limit, page } = req.pagination;
  
      
      const posts = await Post.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
  
    
      const totalDocuments = await Post.countDocuments();
      const totalPages = Math.ceil(totalDocuments / limit);
  
      res.status(200).json({
        page,
        limit,
        totalPages,
        totalDocuments,
        data: posts,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
module.exports = {
    getPosts,
    getPost,
    createPost,
    updatePost,
    softDeletePost,
    restorePost,
    getPostWithLike,
    getPostWithComment,
    getPaginatedPosts
};